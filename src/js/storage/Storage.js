import { CommonHelpers } from '../helpers/Common.js'
import { webSockets } from '@libp2p/websockets'
import { StorageHelpers } from "../helpers/Storage.js";

const ws = new webSockets()

export class Storage {
    commonHelpers = null
	storageHelpers = null

    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.storageHelpers = new StorageHelpers()
	}

	async upload(file, callback) {
		const host = this.commonHelpers.getApiHost()
		return this.storageHelpers.upload(file, `${host}/operad-ai/api/v1/upload`, callback)
	}
}