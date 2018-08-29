const imagemin = require('imagemin')
const ImageminGm = require('imagemin-gm')
const imageminGm = new ImageminGm()
const mime = require('mime/lite')
// require('file-type') happens later down

const defaultOptions = {
	plugins: [],
	guessFormat: true,
}

class ImageminProxy {
	constructor(backend, options) {
		if( !backend || typeof backend !== 'function' ) {
			throw new Error('First argument must be a backend function!')
		}

		this.options = Object.assign({}, defaultOptions, options)
		if( this.options.guessFormat ) {
			// This is an optional dependency, so don't initialize it unless we need it.
			this.fileType = require('file-type')
		}

		this.backend = backend
		return this.route.bind(this)
	}

	route(req, res, next) {
		this.backend(req, res)
			.then(buffer => {
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
					prependPlugins.push(imageminGm.convert(req.query.format))
				}

				return imagemin.buffer(buffer, {
					plugins: prependPlugins.concat(this.options.plugins)
				})
			})
			.then(buf => {
				// Try to guess the content-type if it hasn't been set.
				if( !('content-type' in res._headers) || res._headers['content-type'] === 'application/octet-stream' ) {
					if( 'format' in req.query && req.query.format ) {
						const mimeType = mime.getType(req.query.format)
						if( mimeType ) {
							res.contentType(mimeType)
						}
					} else if( this.options.guessFormat ) {
						// File-type needs only the first 4100 bytes of a buffer.
						const guess = this.fileType(buf.slice(0, 4101))
						if( guess ) {
							res.contentType(guess.mime)
						}
					}
				}

				res.send(buf)
			})
			.catch(err => next(err))
	}
}

module.exports = ImageminProxy
