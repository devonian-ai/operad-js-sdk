import { CID } from 'multiformats/cid'
import { CommonHelpers } from '../helpers/Common.js'
import { webSockets } from '@libp2p/websockets'

import { isBrowser, isNode } from "browser-or-node"
import { StorageHelpers } from "../helpers/Storage.js";

const ws = new webSockets()

export class Storage {
    commonHelpers = null
	storageHelpers = null
	//	ipfsRepoName = './ipfs_repo_' + Math.random()
	ipfsRepoName = './.ipfs'
	ipfsNodeAddr = (process.env.NODE_ENV == 'production') ? '/dns4/web1.operad.ai/tcp/5002/https' : '/ip4/127.0.0.1/tcp/5001'
	ipfsNodeType = 'client'
	ipfsNodeOpts = {
		config: {},
		libp2p: {
			transports: [ws],
			connectionManager: {
				autoDial: false
			}
		}
	}
	ipfs = null
	ipfsStarting = false
	ipfsStarted = false

    constructor() {
		this.commonHelpers = new CommonHelpers()
		this.storageHelpers = new StorageHelpers()
	}

	async upload(file) {
		if(isNode) {
			// NodeJS environment
			let cid
			if(file.content) {
				cid = await this.commonHelpers.addFileUsingReadStream(file.content, file.path, this.ipfs, uploadCallback)
			}
			else if(file.cid) {
				cid = CID.parse(file.cid)
			}
			else {
				return {
					assetElements: null,
					error: `Invalid file provided ${file.path}.`
				}
			}

			results.push({
				cid: cid.toString(),
				path: file.path,
				size: (await this.ipfs.object.stat(cid)).CumulativeSize
			})
		}
		else if(isBrowser) {
			// Browser environment
			let cid
			if(file.content) {
				file = (file.content instanceof File) ? file.content : new File(file.content, file.path)
				cid = await this.commonHelpers.addFileUsingFileReader(file, this.ipfs, uploadCallback)
			}
			else if(file.cid) {
				cid = CID.parse(file.cid)
			}
			else {
				return {
					assetElements: null,
					error: `Invalid file provided ${file.path}.`
				}
			}

			results.push({
				cid: cid.toString(),
				path: file.name || file.path,
				size: (await this.ipfs.object.stat(cid)).CumulativeSize
			})
		}
		else {
			// Unknown
			return {
				assetElements: null,
				error: "Unknown environment. Expected NodeJS or Browser."
			}
		}
	}

	async ensureIpfsIsRunning() {
		if(!this.ipfsStarted && !this.ipfsStarting) {
			this.ipfs = await this.startIpfs()
		}
		else if(!this.ipfsStarted) {
			while(!this.ipfsStarted) {
				await this.commonHelpers.sleep(1000)
			}
		}
		return this.ipfs
	}
}