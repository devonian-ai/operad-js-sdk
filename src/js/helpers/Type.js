import { CommonHelpers } from './Common.js'

export class TypeHelpers {
    constructor() {
		this.commonHelpers = new CommonHelpers()
    }

	async getType(cid, headers = {}) {
		const host = this.commonHelpers.getApiHost()
		const uri = `${host}/operad-ai/api/v1/type?cid=${cid}`
		const method = 'GET'
		headers = {
			...headers,
			'Accept': 'application/json',
		}
		const responseType = null
		let response

		try {
			response = await this.commonHelpers.rest(uri, method,
				headers, responseType, null, true)

			if(response.status > 299) {
				return this.commonHelpers.newErrorPromise(response)
			}
		} catch (error) {
			return this.commonHelpers.newErrorPromise(error)
		}

		return this.commonHelpers.newPromise(response)
	}

    async addType(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/type`
        const method = 'POST'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType, payload, true)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }

            return this.commonHelpers.newPromise(response)
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }
    }

    async getTypes(headers = {}) {
		const host = this.commonHelpers.getApiHost()
		const uri = `${host}/operad-ai/api/v1/types`
		const method = 'GET'
		headers = {
			...headers,
			'Accept': 'application/json',
		}
		const responseType = null
		let response

		try {
			response = await this.commonHelpers.rest(uri, method,
				headers, responseType, null, true)

			if(response.status > 299) {
				return this.commonHelpers.newErrorPromise(response)
			}
		} catch (error) {
			return this.commonHelpers.newErrorPromise(error)
		}

		return this.commonHelpers.newPromise(response)
    }
}