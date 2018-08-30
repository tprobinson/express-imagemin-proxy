const utils = require('./utils')
const images = require('./images')

describe('resize images', () => {
	test('resize 2x2 gif to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
			plugins: [],
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '?width=1&height=1')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallGif.length)
					env.listen.close()
					done()
				})
		})
	})

	test('resize 2x2 jpg to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallJpg), {
			plugins: [],
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '?width=1&height=1')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallJpg.length)
					env.listen.close()
					done()
				})
		})
	})

	test('resize 2x2 png to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: [],
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '?width=1&height=1')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallPng.length)
					env.listen.close()
					done()
				})
		})
	})

	test('resize 2x2 png to 1x1 with gravity', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: [],
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '?width=1&height=1&gravity=south')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeLessThan(images.smallPng.length)
					env.listen.close()
					done()
				})
		})
	})
})
