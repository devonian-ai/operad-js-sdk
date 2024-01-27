import { CommonHelpers } from '../helpers/Common.js'
import { TrustHelpers } from '../helpers/Trust.js'

export class Trust {
    commonHelpers = null
	trustHelpers = null

    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.trustHelpers = new TrustHelpers()
	}
}