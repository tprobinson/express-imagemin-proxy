const fetch = require('node-fetch')
const url = require('url')
const querystring = require('querystring')
const imagemin = require('imagemin')

class ImageminProxy {
	constructor(options) {
		this.options = options
		return this.route
	}

	route(req, res, next) {
		const baseUrl = 'https://s3-us-west-2.amazonaws.com/funko-popspedia-test/pedia'

		const cleanUrl = url.parse(baseUrl + req.url)
		const query = querystring.parse(cleanUrl.query)
		cleanUrl.search = ''

		return fetch(cleanUrl)
			.then(x => {
				if( !x.ok ) {
					return Promise.reject(x)
				}

				return x.buffer()
			})
			.then(buffer => {
				imagemin.buffer(buffer, this.options.imagemin)
			})
			// would do minification right here.
			.then(buf => res.send(buf))
			.catch(err => next(err))
	}
}

module.exports = ImageminProxy
