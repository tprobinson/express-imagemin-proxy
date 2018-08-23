const fetch = require('node-fetch')
const url = require('url')
const imagemin = require('imagemin')
const ImageminGm = require('imagemin-gm')
const imageminGm = new ImageminGm()
const mime = require('mime/lite')

const defaultOptions = {
	plugins: [],
	baseUrl: '',
	guessFormat: true,
}

class ImageminProxy {
	constructor(options) {
		this.options = Object.assign({}, defaultOptions, options)
		if( !this.options.baseUrl ) {
			throw new Error('Need to specify baseUrl!')
		}

		if( this.options.guessFormat ) {
			// This is an optional dependency, so don't initialize it unless we need it.
			this.fileType = require('file-type')
		}

		return this.route.bind(this)
	}

	route(req, res, next) {
		let headersSet = false

		// Use the query parameters to initialize some image resizing plugins
		const prependPlugins = []

		if( 'width' in req.query || 'height' in req.query || 'gravity' in req.query ) {
			const config = {}
			if( 'width' in req.query && req.query.width ) { config.width = req.query.width }
			if( 'height' in req.query && req.query.height ) { config.height = req.query.height }
			if( 'gravity' in req.query && req.query.gravity ) { config.gravity = req.query.gravity }
			prependPlugins.push(imageminGm.resize(config))
		}

		if( 'format' in req.query && req.query.format ) {
			// Try to set the outgoing content-type properly
			if( !headersSet ) {
				const mimeType = mime.getType(req.query.format)
				if( mimeType ) {
					res.contentType(mimeType)
					headersSet = true
				}
			}

			prependPlugins.push(imageminGm.convert(req.query.format))
		}

		// Memory-cache clearUrl fetch here?
		// It would reduce the number of calls for sequential reformats.
		const cleanUrl = url.parse(this.options.baseUrl + req.url)
		cleanUrl.search = ''
		return fetch(cleanUrl)
			// TODO: replace fetch and this first then() with a pluggable backend
			.then(x => {
				if( !x.ok ) {
					return Promise.reject(x)
				}

				// Set the content type from the backend if there is one
				// but not if we've already set it.
				if( !headersSet && x.headers.has('content-type') ) {
					res.contentType(x.headers.get('content-type'))
					headersSet = true
				}

				return x.buffer()
			})
			.then(buffer => {
				return imagemin.buffer(buffer, {
					plugins: prependPlugins.concat(this.options.plugins)
				})
			})
			.then(buf => {
				if( !headersSet && this.options.guessFormat ) {
					// If a content type has not been set, try to figure one out.
					// File-type needs only the first 4100 bytes of a buffer.
					const guess = this.fileType(buf.slice(0, 4101))
					if( guess ) {
						res.contentType(guess.mime)
						headersSet = true
					}
				}
				res.send(buf)
			})
			.catch(err => {
				if( 'status' in err ) {
					// A Fetch error
					res.status(err.status)
					res.send(err.statusText)
				}
				next(err)
			})
	}
}

module.exports = ImageminProxy
