import { CommonHelpers } from './Common.js'

export class TransformationHelpers {
    constructor() {
        this.commonHelpers = new CommonHelpers()
    }

    async addTransformation(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/transformation`
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

    async getTransformation(cid, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/transformation?cid=${cid}`
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

    async getTransformations(search='', headers = {}) {
        const host = this.commonHelpers.getApiHost()
        search = search || ''
        const uri = `${host}/operad-ai/api/v1/transformations?search=${search}`
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

            return this.commonHelpers.newPromise(response)
        } catch (error) {
            return this.commonHelpers.newErrorPromise(error)
        }
    }
    
    async updateTransformation(cid, payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/transformation?cid=${cid}`
        const method = 'PUT'
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
}
