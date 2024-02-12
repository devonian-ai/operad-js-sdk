import axios from 'axios'

export class CommonHelpers {
	apiHost = process.env.NODE_ENV === 'production'
		? process.env.API_PROD_ENDPOINT
		: process.env.API_DEV_ENDPOINT

	constructor() {
    }

	rest(uri, method, headers, responseType, data, credentials) {
		let h = {}
		if(headers)
			Object.assign(h, headers)
		return axios({
			url: uri,
			method: method,
			headers: h,
			responseType: responseType,
			data: (data != undefined) ? data : null,
			withCredentials : (credentials == true) ? true : false
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
