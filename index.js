const Promise = require('bluebird')
const express = require('express')
const ExpressCache = require('./ExpressCache')
const cacheManager = require('cache-manager')
const S3Cache = require('cache-manager-s3')
const ImageminProxy = require('./ImageminProxy')

const imageminPngQuant = require('imagemin-pngquant')

// use cache-manager s3 after imagemin
// reference hapi-imagemin-proxy for code
// support parameters other than just size
const app = express()
const cacheRouter = express.Router()
const cache =
const cacheMiddleware = new ExpressCache(
	cacheManager.caching({
		store: 'memory', max: 10000, ttl: 3600
	})
)
const imageminProxy = new ImageminProxy({
	imagemin: {
		plugins: [
			imageminPngQuant(),
			// etc
		]
	}
})

// Layer the caching in front of the other routes
cacheMiddleware.attach(app)

// Attach the Imagemin route to the router
cacheRouter.all('*', imageminProxy)

// Attach the router to the app
app.use('/cache', cacheRouter)


app.listen(3000)
