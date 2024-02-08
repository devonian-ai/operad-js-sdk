import { CommonHelpers } from './Common.js'

export class ProfileHelpers {
    commonHelpers = null

    constructor() {
        this.commonHelpers = new CommonHelpers()
    }

    async getProfile(headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/profile`
        const method = 'GET'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }

        return this.commonHelpers.newPromise(response)
    }

    async addProfile(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/profile`
        const method = 'POST'
        headers = {
            ...headers,
            'Accept': 'application/json',
        }
        const responseType = null
        let response

        try {
            response = await this.commonHelpers.rest(uri, method,
                headers, responseType, payload)

            if(response.status > 299) {
                return this.commonHelpers.newErrorPromise(response)
            }

            return this.commonHelpers.newPromise(response)
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }
    }
}
