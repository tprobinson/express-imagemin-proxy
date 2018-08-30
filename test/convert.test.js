const utils = require('./utils')
const images = require('./images')
const fileType = require('file-type')

describe('convert images', () => {
	// Waiting for https://github.com/imagemin/imagemin/issues/291
	test.skip('convert gif to png', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '/?format=png')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeGreaterThanOrEqual(images.smallGif.length)
					expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'png')
					env.listen.close()
					done()
				})
		})
	})

	test.skip('convert png to jpg', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.tinyPng), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '/?format=jpg')
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeGreaterThanOrEqual(images.tinyPng.length)
					expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'jpg')
					env.listen.close()
					done()
				})
		})
	})

	test('convert png to gif', done => {
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
					done()
				})
		})
	})
})
