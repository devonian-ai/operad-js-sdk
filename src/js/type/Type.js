import { CommonHelpers } from '../helpers/Common.js'
import { TypeHelpers } from "../helpers/Type.js";

export class Type {
	commonHelpers = null
	typeHelpers = null

	constructor() {
		this.commonHelpers = new CommonHelpers()
		this.typeHelpers = new TypeHelpers()
	}

	/**
	 * Get type
	 */
	async getType(cid, headers = {}) {
		return this.typeHelpers.getType(cid, headers)
	}

	/**
	 * Add type
	 */
	async addType(payload, headers = {}) {
		return this.typeHelpers.addType(payload, headers)
	}

	/**
	 * Get types
	 */
	async getTypes(search = '', headers = {}) {
		return this.typeHelpers.getTypes(search, headers)
	}
}
