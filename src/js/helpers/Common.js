import axios from 'axios'

export class CommonHelpers {
    constructor() {
    }

	rest(uri, method, headers, responseType, data) {
		return axios({
			url: uri,
			method: method,
			headers: headers,
			responseType: responseType,
			data: (data != undefined) ? data : null
		})
	}

	sleep = ms => new Promise(r => setTimeout(r, ms))
}