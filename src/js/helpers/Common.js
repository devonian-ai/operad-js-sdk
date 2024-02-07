import axios from 'axios'

export class CommonHelpers {
	apiHost = process.env.NODE_ENV === 'production'
		? process.env.API_PROD_ENDPOINT
		: process.env.API_DEV_ENDPOINT

    constructor() {
    }

	rest(uri, method, headers, responseType, data) {
		return axios({
			url: uri,
			method: method,
			headers: headers,
			responseType: responseType,
			data: (data != undefined) ? data : null,
		})
	}

	sleep = ms => new Promise(r => setTimeout(r, ms))

	getApiHost = () => this.apiHost

	newPromise = (response) => new Promise((resolve, reject) => {
		resolve({
			error: null,
			result: response
		})
	})

	newErrorPromise = (response) => new Promise((resolve, reject) => {
		reject({
			error: response,
			result: null
		})
	})
}
