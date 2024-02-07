export class StorageHelpers {

//	blockSize = 1048576
    blockSize = 524288

    async upload(file, host, callback) {
        const that = this
        const blockSize = this.blockSize
        host = host.replace('http', 'ws')
        host = host.replace('https', 'wss')
        let ws = new WebSocket(host);
        // Notes:
        // - Copied from co2.storage 
        // - Commented out as it throws error:
        //      "Failed to construct 'WebSocket': The subprotocol '[object Object]' is invalid." 
        // let ws = new WebSocket(host, {
        //     headers: {
        //         "Connection": "upgrade",
        //         "Upgrade": "websocket"
        //     }
        // })

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
}