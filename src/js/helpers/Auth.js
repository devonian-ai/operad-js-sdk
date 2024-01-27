import { CommonHelpers } from './Common.js'

export class AuthHelpers {
    constructor() {
		this.commonHelpers = new CommonHelpers()
    }

	async authenticate(host, signature) {
		const authenticateUri = `${host}/operad-ai/api/v1/authenticate?signature=${signature}`
		const authenticateMethod = 'GET'
		const authenticateHeaders = {
			'Accept': 'application/json'
		}
		const authenticateResponseType = null
		let authenticateResponse

		try {
			authenticateResponse = await this.commonHelpers.rest(authenticateUri, authenticateMethod,
				authenticateHeaders, authenticateResponseType)

			if(authenticateResponse.status > 299) {
				return new Promise((resolve, reject) => {
					reject({
						error: authenticateResponse,
						result: null
					})
				})
			}
		} catch (error) {
			return new Promise((resolve, reject) => {
				reject({
					error: error,
					result: null
				})
			})
		}

		return new Promise((resolve, reject) => {
			resolve({
				error: null,
				result: authenticateResponse
			})
		})
	}
}