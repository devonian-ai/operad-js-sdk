import { CommonHelpers } from '../helpers/Common.js'
import { AuthHelpers } from '../helpers/Auth.js'
import { Identity } from '../identity/Identity.js'
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util'

export class Auth {
    commonHelpers = null
	authHelpers = null
	authType = null
	identifier = null
	identity = null
	apiHost = (process.env.NODE_ENV == 'production') ? `${process.env.API_PROD_ENDPOINT}` : `${process.env.API_DEV_ENDPOINT}`
	apiToken = null
	ethereumChainId = 1
	verifyingMessageSignatureContractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"geteip712DomainHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"string","name":"message","type":"string"}],"name":"gethashStruct","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"verifySignature","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
	verifyingMessageSignatureContractAddress = "0x3cF60d94C95965D20E904e28fCf2DD0a14DB384f"

    constructor(options) {
		if(options.authType != undefined)
			this.authType = options.authType
		if(options.identifier != undefined)
			this.identifier = options.identifier
		if(options.apiHost != undefined)
			this.apiHost = options.apiHost

		this.commonHelpers = new CommonHelpers()
		this.authHelpers = new AuthHelpers()
		this.identity = new Identity(this.authType, this.identifier)
	}

	async getIdentifier() {
		const getIdentifierResponse = await this.identity.getIdentifier()
		if(getIdentifierResponse.error != null) {
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					web3: null,
					error: getIdentifierResponse.error
				})
			})
		}
		return new Promise((resolve, reject) => {
			resolve({
				result: getIdentifierResponse.result,
				web3: getIdentifierResponse.web3,
				error: null
			})
		})
	}

	async authenticate(signature) {
		const getIdentifierResponse = await this.getIdentifier()
		if(getIdentifierResponse.error != null)
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: getIdentifierResponse.error
				})
			})
		this.identifier = getIdentifierResponse.result		

		let result
		try {
			result = (await this.authHelpers.authenticate(this.apiHost, signature)).result
		} catch (error) {
			return new Promise((resolve, reject) => {
				reject({
					error: error,
					result: null
				})
			})
		}

		return new Promise((resolve, reject) => {
			resolve({
				error: null,
				result: result
			})
		})
	}

	async signMessage(message) {
		const that = this

		const getIdentifierResponse = await this.getIdentifier()
		if(getIdentifierResponse.error != null)
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: getIdentifierResponse.error
				})
			})
		this.identifier = getIdentifierResponse.result
	
		const web3 = getIdentifierResponse.web3
		let chainId = Number(await web3.eth.getChainId())
		if(chainId != this.ethereumChainId) {
			try {
				const switchNetworkResponse = await this.switchNetwork(this.ethereumChainId)
				chainId = await switchNetworkResponse.result
			} catch (error) {
				return new Promise((resolve, reject) => {
					reject({
						result: null,
						error: error
					})
				})
			}
		}

		const from = this.identifier;
		const msgParams = {
			domain: {
			  name: 'CO2.storage Message',
			  version: '1',
			  chainId: chainId,
			  verifyingContract: this.verifyingMessageSignatureContractAddress,
			},
			message: {
			  signer: from,
			  message: message
			},
			primaryType: 'Record',
			types: {
			  EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' },
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
			  ],
			  Record: [
				{ name: 'signer', type: 'address' },
				{ name: 'message', type: 'string' }
			  ],
			},
		}

		const params = [from, JSON.stringify(msgParams)];
		var method = 'eth_signTypedData_v4';

		const rpcRequest = {
			method,
			params,
			from,
		}
		const rpcResponse = function (err, result) {
			if (err) {
				return {
					result: null,
					error: err
				}
			}
			if (result.error) {
				return {
					result: null,
					error: result
				}
			}
			try {
				const signatureResponse = result.result
				const signature = signatureResponse.substring(2)
				const r = "0x" + signature.substring(0, 64)
				const s = "0x" + signature.substring(64, 128)
				const v = parseInt(signature.substring(128, 130), 16)
				const resp = {
					method: method,
					account: from,
					verifyingContract: that.verifyingMessageSignatureContractAddress,
					chainId: chainId,
					message: message,
					typedData: btoa(JSON.stringify(msgParams)),
					signature: signatureResponse,
					r: r,
					s: s,
					v: v
				}

				return {
					result: resp,
					error: null
				}
			} catch (error) {
				return {
					result: null,
					error: error
				}
			}
		}
		if(web3.currentProvider.isMetaMask) {
			let rsp = await web3.currentProvider.request(rpcRequest)
			let response = rpcResponse(null, {
				result: rsp,
				error: null
			})
			return new Promise((resolve, reject) => {
				resolve(response)
			}) 
		}
		else {
			const pk = process.env.PRIVATE_KEY.replace("0x", "")
			const signature = signTypedData({
				privateKey: pk,
				data: msgParams,
				version: SignTypedDataVersion.V4,
			})
			let response = rpcResponse(null, {
				result: signature,
				error: null
			})
			return new Promise((resolve, reject) => {
				resolve(response)
			})
		}
	}

	async switchNetwork(chainId) {
		const getIdentifierResponse = await this.getIdentifier()
		if(getIdentifierResponse.error != null)
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: getIdentifierResponse.error
				})
			})
	
		const web3 = getIdentifierResponse.web3

		if(typeof chainId == "string" && chainId.indexOf("0x") != 0) {
			chainId = `0x${chainId}`
		}
		else {
			chainId = `0x${chainId.toString(16)}`
		}

		try {
			const rpcRequest = {
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainId}],
			}

			if(web3.currentProvider.request) {
				await web3.currentProvider.request(rpcRequest)
			}
			else {
				await web3.currentProvider.send(rpcRequest)
			}

			chainId = Number(await web3.eth.getChainId())

			return new Promise((resolve, reject) => {
				resolve({
					result: chainId,
					error: null
				})
			})
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				// TODO, add network to metamask
			}
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: switchError
				})
			})
		}
	}

	async login(signType) {
		const getIdentifierResponse = await this.getIdentifier()
		if(getIdentifierResponse.error != null)
			return new Promise((resolve, reject) => {
				reject({
					result: null,
					error: getIdentifierResponse.error
				})
			})
		this.identifier = getIdentifierResponse.result

		let signatureResponse = {}

		switch (signType) {
			case "eth_signTypedData_v4":
				const message = `Login request made on ${(new Date()).toISOString()}`
				try {
					signatureResponse = (await this.signMessage(message))
				} catch (error) {
					return new Promise((resolve, reject) => {
						reject({
							error: error,
							result: null
						})
					})
				}
				break
			case "email":
				signatureResponse.error = null
				signatureResponse.result = {
					typedData: null,
					signature: null
				}
				break
			default:
				return new Promise((resolve, reject) => {
					reject({
						error: `Unknown signature type ${signType}`,
						result: null
					})
				})
				break
		}

		let result
		try {
			result = (await this.authHelpers.login(this.apiHost, signType, this.identifier,
				signatureResponse.result.typedData, signatureResponse.result.signature)).result
		} catch (error) {
			return new Promise((resolve, reject) => {
				reject({
					error: error,
					result: null
				})
			})
		}

		return new Promise((resolve, reject) => {
			resolve({
				error: null,
				result: result
			})
		})
	}

}