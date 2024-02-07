export class StorageHelpers {

//	blockSize = 1048576
    blockSize = 524288

    async upload(file, host, callback) {
        const that = this
        const blockSize = this.blockSize
        host = host.replace('http', 'ws')
        host = host.replace('https', 'wss')
        let ws = new WebSocket(host, {
            headers: {
                "Connection": "upgrade",
                "Upgrade": "websocket"
            }})

        let filePos = 0
        let reader = new FileReader()
        let cancel = false
        let blob

        ws.binaryType = 'arraybuffer'

        // Send filename and size to the server when the connection is opened
        ws.onopen = function(evt) {
            const header = '{"filename":"' + file.name + '","size":' + file.size + '}'
            ws.send(header)

            // Initiate the file transfer by reading the first block from disk
            blob = that.readBlob(file, reader, filePos, blockSize)
        }


        // Send the next file block to the server once it's read from disk
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                ws.send(blob.Buffer)
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

    async addFileUsingReadStream(readStream, fileName, ipfs, callback) {
        const that = this
        const blockSize = this.blockSize
        let docChunk = []
        let docChunkBytes = 0
        let ipfsAdditions = []
        let completed = false
        let result = null

        readStream.on('error', (error) => {
            console.log(error.message)
            readStream.close()
            readStream.destroy()
            completed = true
        })
        readStream.on('data', async (chunk) => {
            docChunkBytes += chunk.byteLength
            // When mine file chunk is achieved
            // pause read stream and add ipfs file chunk
            if(docChunkBytes >= blockSize) {
                readStream.pause()
                // Take a slice size up to a blockSize
                const endingChunk = chunk.slice(0, blockSize)
                docChunk.push(endingChunk)
                // Queue chunk to be added to ipfs
                await this.queueChunk(ipfs, docChunk, ipfsAdditions, fileName, callback)
                // Reset reading but first add what remained from previous reading
                docChunk.length = 0
                const startingChunk = chunk.slice(blockSize, docChunkBytes)
                docChunk.push(startingChunk)
                docChunkBytes = startingChunk.byteLength
                // read next chunk
                readStream.resume()
            }
            else {
                // Concatenate received chunks until
                // min file chunk size is achieved
                docChunk.push(chunk)
            }
        })
        readStream.on('end', async() => {
            // Queue chunk to be added to ipfs
            await this.queueChunk(ipfs, docChunk, ipfsAdditions, fileName, callback)
            // Link chunks into a final block
            result = await that.linkChunks(ipfs, ipfsAdditions, fileName, callback)
            completed = true
            readStream.close()
            readStream.destroy()
        })

        while(!completed) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        return result
    }

    async addFileUsingFileReader(file, ipfs, callback) {
        const that = this
        const blockSize = this.blockSize
        let filePos = 0
        let reader = new FileReader()
        let ipfsAdditions = []
        let blob
        let completed = false
        let result = null

        // Initiate the file transfer by reading the first block from disk
        blob = this.readBlob(file, reader, filePos, blockSize)

        // Add the next file slice to the ipfs once it's read from disk
        reader.onloadend = async function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                await that.queueChunk(ipfs, blob, ipfsAdditions, file.name, callback)
                filePos += blob.size
                if (filePos >= file.size) {
                    result = await that.linkChunks(ipfs, ipfsAdditions, file.name, callback)
                    completed = true
                    return
                }

                // Read the next file slice
                blob = that.readBlob(file, reader, filePos, blockSize)
            }
        }

        reader.onabort = function() {
            callback({
                code: 400,
                status: 'aborted',
                progress: 0,
                filename: file.name,
                cid: null
            })
            completed = true
        }

        reader.onerror = function() {
            callback({
                code: 500,
                status: 'error',
                progress: 0,
                filename: file.name,
                cid: null
            })
            completed = true
        }

        while(!completed) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        return result
    }
}