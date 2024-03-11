import { CommonHelpers } from '../helpers/Common.js'
import { StorageHelpers } from "../helpers/Storage.js";

export class Storage {
	commonHelpers = null
	storageHelpers = null

	constructor() {
		this.commonHelpers = new CommonHelpers()
		this.storageHelpers = new StorageHelpers()
	}

	async upload(file, name, description, priv, signature, callback) {
		name = name || ''
		description = description || ''
		priv = priv || 'false'
		signature = signature || ''
		const host = this.commonHelpers.getApiHost()

		return await this.storageHelpers.upload(file, `${host}/operad-ai/api/v1/upload?signature=${signature}&name=${name}&description=${description}&private=${priv}`, callback)
	}

	async download(path, signature) {
		signature = signature || ''
		const host = this.commonHelpers.getApiHost()

		return await this.storageHelpers.download(host, path, signature)
	}
	
	/**
	 * Get asset
	 */
	async getAsset(cid, headers = {}) {
		return this.storageHelpers.getAsset(cid, headers)
	}

	/**
	 * Add asset
	 */
	async addAsset(payload, headers = {}) {
		return this.storageHelpers.addAsset(payload, headers)
	}
}