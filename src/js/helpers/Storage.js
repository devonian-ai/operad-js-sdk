import { CommonHelpers } from './Common.js'

export class StorageHelpers {
    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.blockSize = 524288
    }

	// Web socket upload, browser, filereader
	async upload(file, host, callback) {
		const that = this
		const blockSize = this.blockSize
		host = host.replace('http', 'ws')
		host = host.replace('https', 'wss')
		let ws = new WebSocket(host)

		let filePos = 0
		let reader = new FileReader()
		let cancel = false
		let blob

		ws.binaryType = 'arraybuffer'

		// Send filename and size to the server when the connection is opened
		ws.onopen = function(evt) {
			const header = JSON.stringify({
				name: file.name,
				type: file.type,
				size: file.size
			})
			ws.send(header)

			// Initiate the file transfer by reading the first block from disk
			blob = that.readBlob(file, reader, filePos, blockSize)
		}


		// Send the next file block to the server once it's read from disk
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) {
				ws.send(blob)
				filePos += blob.size
				callback({
					code: null,
					status: 'uploading',
					progress: (filePos / file.size) * 100.0,
					filename: file.name
				})
				if (filePos >= file.size) {
					callback({
						code: 200,
						status: 'uploaded',
						progress: 100.0,
						filename: file.name
					})
				}
				if (cancel) {
					callback({
						code: 400,
						status: 'cancelled',
						progress: 0,
						filename: file.name
					})
				}
			}
		}

		// Process message sent from server
		ws.onmessage = function(e) {
			// Server only sends text messages
			if (typeof e.data === "string") {
				// "NEXT" message confirms the server received the last block
				if (e.data === "NEXT") {
					// If we're not cancelling the upload, read the next file block from disk
					if (cancel) {
						callback({
							code: 400,
							status: 'cancelled',
							progress: 0,
							filename: file.name
						})
					} else {
						blob = that.readBlob(file, reader, filePos, blockSize)
					}
				// Otherwise, message is a status update (json)
				} else {
					callback(JSON.parse(e.data))
				}
			}
		}

		ws.onclose = function(evt) {
			ws = null
		}

		ws.onerror = function(evt) {
			ws.close()
			ws = null
			return false
		}
	}

	// Read a slice using FileReader
	readBlob(file, reader, filePos, blockSize) {
		let first = filePos
		let last = first + blockSize
		if (last > file.size) {
			last == file.size
		}
		let blob = file.slice(first, last)
		reader.readAsArrayBuffer(blob)
		return blob
	}

	async download(host, path, signature) {
		const downloadUri = `${host}/operad-ai/api/v1/download?signature=${signature}&path=${path}`
		const downloadMethod = 'GET'
		const downloadHeaders = {
			'Accept': 'application/octet-stream'
		}
		const downloadResponseType = 'blob'
		let downloadResponse

		try {
			downloadResponse = await this.commonHelpers.rest(downloadUri, downloadMethod,
				downloadHeaders, downloadResponseType, null, true)

			if(downloadResponse.status > 299) {
				return new Promise((resolve, reject) => {
					reject({
						error: downloadResponse,
						result: null
					})
				})
			}
		} catch (error) {
			return new Promise((resolve, reject) => {
				reject({
					error: error,
					result: null
				})
			})
		}

		return new Promise((resolve, reject) => {
			resolve({
				error: null,
				result: downloadResponse
			})
		})
	}

    async getAsset(cid, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/asset?cid=${cid}`
        const method = 'GET'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType, null, true)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }

        return this.commonHelpers.newPromise(response)
    }

    async addAsset(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = (Object.prototype.toString.call(payload.payload) === '[object String]') ?
			`${host}/operad-ai/api/v1/payload` : `${host}/operad-ai/api/v1/asset`
        const method = 'POST'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType, payload, true)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }

            return this.commonHelpers.newPromise(response)
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }
    }

	async getType(cid, headers = {}) {
		const host = this.commonHelpers.getApiHost()
		const uri = `${host}/operad-ai/api/v1/type?cid=${cid}`
		const method = 'GET'
		headers = {
			...headers,
			'Accept': 'application/json',
		}
		const responseType = null
		let response

		try {
			response = await this.commonHelpers.rest(uri, method,
				headers, responseType, null, true)

			if(response.status > 299) {
				return this.commonHelpers.newErrorPromise(response)
			}
		} catch (error) {
			return this.commonHelpers.newErrorPromise(error)
		}

		return this.commonHelpers.newPromise(response)
	}

    async addType(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/type`
        const method = 'POST'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType, payload, true)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }

            return this.commonHelpers.newPromise(response)
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }
    }
}