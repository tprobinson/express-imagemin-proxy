const utils = require('./utils')
const images = require('./images')

describe('erroneous usage', () => {
	test('error when provided nothing', done => {
		utils.createTestEnvironment(utils.serveBuffer(), {
			plugins: [],
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(500)
					expect(response.type).toBe('text/html')
					env.listen.close()
					done()
				})
		})
	})

	test('error with bogus format conversion', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: utils.imageminPlugins,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getPathAsBinary(env.app, '/?format=pingpong')
				.then(response => {
					expect(response.statusCode).toBe(500)
					expect(response.type).toBe('text/html')
					env.listen.close()
					done()
				})
		})
	})
})
