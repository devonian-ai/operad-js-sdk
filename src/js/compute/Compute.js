import { CommonHelpers } from '../helpers/Common.js'
import { ComputeHelpers } from '../helpers/Compute.js'

export class Compute {
    commonHelpers = null
	computeHelpers = null

    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.computeHelpers = new ComputeHelpers()
	}
}