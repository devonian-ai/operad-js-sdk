import {TransformationHelpers} from "../helpers/Transformation.js";

export class Transformation {
	transformationHelper = null

	constructor() {
		this.transformationHelper = new TransformationHelpers()
	}

	/**
	 * Add transformation
	 */
	async addTransformation(payload, headers = {}) {
		return this.transformationHelper.addTransformation(payload, headers)
	}

	/**
	 * Get transformation details
	 */
	async getTransformation(cid, headers = {}) {
		return this.transformationHelper.getTransformation(cid, headers)
	}

	/**
	 * Get all transformations
	 */
	async getTransformations(search='', headers = {}) {
		return this.transformationHelper.getTransformations(search, headers)
	}

	/**
	 * Update transformation
	 */
	async updateTransformation(cid, payload, headers = {}) {
		return this.transformationHelper.updateTransformation(cid, payload, headers)
	}
}
