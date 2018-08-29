const utils = require('./utils')
const images = require('./images')

describe('minified images are not changed', () => {
	test('get minified gif', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.tinyGif), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body).toHaveLength(images.tinyGif.length)
					expect(response.body).toEqual(images.tinyGif)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified jpeg', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.tinyJpg), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body).toHaveLength(images.tinyJpg.length)
					expect(response.body).toEqual(images.tinyJpg)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified png', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.tinyPng), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body).toHaveLength(images.tinyPng.length)
					expect(response.body).toEqual(images.tinyPng)
					env.listen.close()
					done()
				})
		})
	})

	test('get minified svg', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.tinySvg), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body).toHaveLength(images.tinySvg.length)
					expect(response.body).toEqual(images.tinySvg)
					env.listen.close()
					done()
				})
		})
	})
})
