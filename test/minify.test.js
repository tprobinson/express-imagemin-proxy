const utils = require('./utils')
const images = require('./images')

describe('minify images', () => {
	test('get minified gif', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallGif.length)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified jpeg', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallJpg), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }
			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallJpg.length)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified png', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
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

	// Waiting for https://github.com/sindresorhus/is-svg/pull/18
	test.skip('get minified svg', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallSvg), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallSvg.length)
					env.listen.close()
					done()
				})
		})
	})
})
