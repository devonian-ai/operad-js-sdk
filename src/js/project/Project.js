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

	/**
	 * Get project details
	 */
	async getProject(cid, headers = {}) {
		return this.projectHelper.getProject(cid, headers)
	}

	/**
	 * Get all projects
	 */
	async getProjects(search='', headers = {}) {
		return this.projectHelper.getProjects(search, headers)
	}
}
