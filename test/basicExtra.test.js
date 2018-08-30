const utils = require('./utils')
const images = require('./images')
const fileType = require('file-type')

describe('options', () => {
	test('get minified png with content-type preset', done => {
		utils.createTestEnvironment(utils.serveBufferWithContentType(images.smallPng, 'image/png'), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallPng.length)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified png without guessing format', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: utils.imageminPlugins,
			guessFormat: false,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.type).toBe('application/octet-stream')
					expect(response.body.length).toBeLessThan(images.smallPng.length)
					env.listen.close()
					done()
				})
		})
	})
})

describe('unusual edge cases', () => {
	test('graphicsmagick converts to a format that MIME is unaware of', done => {
		process.env.DUMB_MIME = true
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '/?format=gif')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallPng.length)
					expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'gif')
					env.listen.close()
					delete process.env.DUMB_MIME
					done()
				})
		})
	})
})
