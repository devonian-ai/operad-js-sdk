import {ProjectHelpers} from "../helpers/Project.js";

export class Project {
	projectHelper = null

	constructor() {
		this.projectHelper = new ProjectHelpers()
	}

	/**
	 * Add project
	 */
	async addProject(payload, headers = {}) {
		return this.projectHelper.addProject(payload, headers)
	}
}
