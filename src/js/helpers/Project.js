import { CommonHelpers } from './Common.js'

export class ProjectHelpers {
    commonHelpers = null

    constructor() {
        this.commonHelpers = new CommonHelpers()
    }

    async addProject(payload, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/project`
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

    async getProject(cid, headers = {}) {
        const host = this.commonHelpers.getApiHost()
        const uri = `${host}/operad-ai/api/v1/project?cid=${cid}`
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
