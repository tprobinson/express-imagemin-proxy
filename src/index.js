const imagemin = require('imagemin')
const ImageminGm = require('imagemin-gm')
const mime = require('mime/lite')
// require('file-type') happens later down

const defaultOptions = {
	plugins: [],
	guessFormat: true,
	graphicsmagickPath: undefined,
}

/**
	* @external {ExpressRequest} https://expressjs.com/en/api.html#req
	*/

/**
  * @external {ExpressResponse} https://expressjs.com/en/api.html#res
  */

class ImageminProxy {
	/**
	 * Initializes and returns an Express route.
	 * @param {function} backend Any function that returns a promise to a Buffer of an image
	 * @param {object} options Options for Imagemin and for this route.
	 * @param {function[]} options.plugins Imagemin plugins, in an array.
	 * @param {boolean} options.guessFormat Whether this route should attempt to guess the format of an image if not already set.
	 */
	constructor(backend, options) {
		if( !backend || typeof backend !== 'function' ) {
			throw new Error('First argument must be a backend function!')
		}

		this.options = Object.assign({}, defaultOptions, options)
		if( this.options.guessFormat ) {
			// This is an optional dependency, so don't initialize it unless we need it.
			this.fileType = require('file-type')
		}

		this.imageminGm = new ImageminGm(this.options.graphicsmagickPath)

		this.backend = backend
		return this.route.bind(this)
	}

	/**
	 * The actual Express middleware.
	 * Runs the backend, then takes the response and minifies it according to:
	 * query parameters specifying reformat
	 * query parameters specifying resize
	 * minifying plugins
	 * content-type and file-type guessing
	 * @param  {ExpressRequest}   req  Express request
	 * @param  {ExpressResponse}   res  Express response
	 * @param  {Function} next next function to pass to the next middleware
	 */
	route(req, res, next) {
		this.backend(req, res)
			.then(buffer => {
				// Use the query parameters to initialize some image resizing plugins
				const prependPlugins = []

				const resizeConfig = {}
				if( 'width' in req.query && req.query.width ) { resizeConfig.width = req.query.width }
				if( 'height' in req.query && req.query.height ) { resizeConfig.height = req.query.height }
				if( 'gravity' in req.query && req.query.gravity ) { resizeConfig.gravity = req.query.gravity }
				if( Object.keys(resizeConfig).length > 0 ) {
					prependPlugins.push(this.imageminGm.resize(resizeConfig))
				}

				if( 'format' in req.query && req.query.format ) {
					prependPlugins.push(this.imageminGm.convert(req.query.format))
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
