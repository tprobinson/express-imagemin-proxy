const utils = require('./utils')
const images = require('./images')
const ImageminGm = require('imagemin-gm')
const imageminGm = new ImageminGm()

const resizeToOne = [imageminGm.resize({width: 1, height: 1})].concat(utils.imageminPlugins)

describe('resize images', () => {
	test('resize 2x2 gif to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
			plugins: resizeToOne,
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

	test('resize 2x2 jpg to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallJpg), {
			plugins: resizeToOne,
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

	test('resize 2x2 png to 1x1', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
			plugins: resizeToOne,
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
})
