const app = require('express')()
const bodyParser = require('body-parser')
const compression = require('compression')
const status = require('express-status-monitor')
const hapiImageminProxy = require('express-imagemin-proxy')
const port = 3000

app.disable('x-powered-by')
app.use(compression())
app.use(status())

let cachePlugin
if( !('S3_ACCESS_KEY' in process.env) || !process.env.S3_ACCESS_KEY ) {
	cachePlugin = require('prerender-memory-cache')
	console.log('No S3 key detected, using memory cache')
} else {
	cachePlugin = new S3Cache({
		accessKey: process.env.S3_ACCESS_KEY,
		secretKey: process.env.S3_SECRET_KEY,
		bucket: process.env.S3_BUCKET,
	})
}

app.get('*', prerender.onRequest)

// dont check content-type and just always try to parse body as json
app.post('*', bodyParser.json({ type: () => true }), prerender.onRequest)

app.listen(port, () => console.log(`Server accepting requests on port ${port}`))


const AutoCache = require('./cache.js')
const imageminPngquant = require('imagemin-pngquant')
const imageminJpegOptim = require('imagemin-jpegoptim')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminSvgo = require('imagemin-svgo')



const plugins = [{
// 	register: require('good'),
// 	options: {
// 		reporters: {
// 			console: [
// 				{
// 					module: 'good-squeeze',
// 					name: 'Squeeze',
// 					args: [{ log: '*', request: '*' }]
// 				},
// 				{
// 					module: 'good-console',
// 					args: [{ format: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' }]
// 				},
// 				'stdout'
// 			]
// 		}
// 	},
// }, {
	plugin: hapiImageminProxy,
	options: {
		source: 'https://s3-us-west-2.amazonaws.com/funko-popspedia-test',
		cache: {
			privacy: 'public',
			expiresIn: 60 * 60 * 1000,
		},
		imagecache: new AutoCache(),
		plugins: [
			imageminPngquant({quality: '45-80'}),
			imageminJpegOptim({max: 90}),
			imageminGifsicle({colors: 256, optimizationLevel: 3, interlaced: true}),
			imageminSvgo({plugins: [{removeViewBox: false}]}),
		],
	},
}]

server.register(plugins).then(() => {
	// We don't serve their kind here
	server.route({
		method: 'GET',
		path: '/favicon.ico',
		handler: (request, h) => h.response().code(404)
	})

	return server.start(() => server.log('info', `Server running at: ${server.info.uri}`))
})
