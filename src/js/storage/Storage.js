import { CommonHelpers } from '../helpers/Common.js'
import { StorageHelpers } from "../helpers/Storage.js";

export class Storage {
	commonHelpers = null
	storageHelpers = null

	constructor() {
		this.commonHelpers = new CommonHelpers()
		this.storageHelpers = new StorageHelpers()
	}

	async upload(file, signature, callback) {
		signature = signature || ''
		const host = this.commonHelpers.getApiHost()

		return await this.storageHelpers.upload(file, `${host}/operad-ai/api/v1/upload?signature=${signature}`, callback)
	}

	async download(path, signature, callback) {
		signature = signature || ''
		const host = this.commonHelpers.getApiHost()

		return await this.storageHelpers.download(`${host}/operad-ai/api/v1/download?signature=${signature}&path=${path}`, callback)
	}
}