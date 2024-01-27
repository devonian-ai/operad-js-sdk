import { Identity } from '../identity/Identity.js'

export class Auth {
    commonHelpers = null
	authHelpers = null
	authType = null
	identifier = null
	identity = null
	apiHost = (process.env.NODE_ENV == 'production') ? `${process.env.API_PROD_ENDPOINT}` : `${process.env.API_PROD_ENDPOINT}`
	apiToken = null

    constructor(options) {
		if(options.authType != undefined)
			this.authType = options.authType
		if(options.identifier != undefined)
			this.identifier = options.identifier
		if(options.apiHost != undefined)
			this.apiHost = options.apiHost
		if(options.apiToken != undefined)
			this.apiToken = options.apiToken

		this.commonHelpers = new CommonHelpers()
		this.authHelpers = new AuthHelpers()
		this.identity = new Identity(this.authType, this.identifier)
	}

	async getIdentifier() {
		const getIdentifierResponse = await this.identity.getIdentifier()
		if(getIdentifierResponse.error != null) {
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					web3: null,
					error: getIdentifierResponse.error
				})
			})
		}
		return new Promise((resolve, reject) => {
			resolve({
				result: getIdentifierResponse.result,
				web3: getIdentifierResponse.web3,
				error: null
			})
		})
}

	async authenticate(signature) {
		const getIdentifierResponse = await this.getIdentifier()
		if(getIdentifierResponse.error != null)
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: getIdentifierResponse.error
				})
			})
		this.identifier = getIdentifierResponse.result		

		let result
		try {
			result = (await this.authHelpers.authenticate(this.apiHost, signature)).result
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
				result: result
			})
		})
	}
}