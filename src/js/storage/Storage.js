import { CommonHelpers } from '../helpers/Common.js'
import { StorageHelpers } from '../helpers/Storage.js'

export class Storage {
    commonHelpers = null
	storageHelpers = null

    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.storageHelpers = new StorageHelpers()
	}
}