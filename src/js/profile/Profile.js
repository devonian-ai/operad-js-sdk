import {ProfileHelpers} from "../helpers/Profile.js";

export class Profile {
	profileHelper = null

    constructor() {
		this.profileHelper = new ProfileHelpers()
	}

	/**
	 * Get user profile details
	 */
	async getProfile(headers = {}) {
		return this.profileHelper.getProfile(headers)
	}

	/**
	 * Add user profile details
	 */
	async addProfile(payload, headers = {}) {
		return this.profileHelper.addProfile(payload, headers)
	}
}
