const express = require('express')
const async = require('async')
const concat = require('concat-stream')
const url = require('url')
const querystring = require('querystring')
const intercept = require('express-mung')

// Temp
// const backend = require('./backend')
const fetch = require('node-fetch')
const baseUrl = 'https://s3-us-west-2.amazonaws.com/funko-popspedia-test/pedia'
class ShortCircuit {
	constructor(payload) {
		this.payload = payload
	}
}

const shortCircuitIfTruthy = (item, callback) => {
	if( item ) {
		callback(new ShortCircuit(item))
	} else {
		callback()
	}
}

const httpToCacheMapping = {
	'get': 'get',
	'put': 'set',
	'delete': 'del',
	'post': 'setex',
	'head': 'head',
}

function noQueryParamKey(req) {
	const parsed = url.parse(req.url)
	return parsed.pathname
}

const defaultOptions = {
	exposeErrors: true,
	getCacheKey: noQueryParamKey
}

class CacheMiddleware {
	constructor(cacheManager, options = {}) {
		this.options = Object.assign({}, defaultOptions, options)
		this.cache = cacheManager
	}

	attach(app) {
		// Intercept request to get from cache if possible
		app.use('*', (req, res, next) => {
			const cacheKey = this.options.getCacheKey(req)
			req.cacheKey = cacheKey
			this.cacheGet(cacheKey, (err, result) => err ? next(err) : result ? res.send(result) : next())
		})

		// Any requests after this will be stored in cache.
		app.use('*', intercept.jsonAsync((json, req, res) => this.cacheSetAsync(req.cacheKey, json)))
		app.use('*', intercept.write((buffer, encoding, req, res) => this.cacheSet(req.cacheKey, buffer)))
	}

	cacheGet(key, cb) {
		this.cache.get(key, cb)
	}

	// Because mung expects a "modified" value, cacheSet* functions must return the original value.
	cacheSet(key, value, cb) {
		this.cache.set(key, value, err => {
			if( err ) { return cb(err) }
			if( cb ) { cb(null, value) }
		})
	}

	cacheSetAsync(key, value) {
		return new Promise((resolve, reject) => {
			this.cache.set(key, value, err => {
				if( err ) { return reject(err) }
				resolve(value)
			})
		})
	}


	get(req, res, next) {
		const cleanUrl = url.parse(baseUrl + req.url)
		const query = querystring.parse(cleanUrl.query)
		cleanUrl.search = ''
		const cacheKey = cleanUrl.pathname
		console.log('url', cleanUrl.format(), 'qs', querystring.stringify(query))

		async.waterfall([
			// // If cache miss, run backend() and then set response.
			// // Or just wrap() backend() and run that to let cache-manager do it
			// const self = this
			// this.cache.wrap(req.url, function(wrapCb) {
			//   self.runBackendExpressly(req, res,)
			// }, (err, data) => {
			//   if( err ) {
			//     console.log('')
			//   }
			// })
			// this.runBackendExpressly
			waterCb => this.cache.get(cacheKey, waterCb),
			shortCircuitIfTruthy,
			// Go get the clean content if we didn't get it from cache
			async.asyncify(() =>
				fetch(cleanUrl)
					.then(x => {
						if( !x.ok ) {
							debugger
							return Promise.reject(x)
						}

						return x.buffer()
					})
			),
			// would do minification right here.
			(result, waterCb) => this.cache.set(cacheKey, result, err => waterCb(err, result)),
		].map(x => x.bind(this)), (err, result) => {
			if( err instanceof ShortCircuit ) {
				result = err.payload
				err = null
			}

			if( err ) {
				return next(err)
			}

			res.send(result)
			next()
		})
	}
}

module.exports = CacheMiddleware
