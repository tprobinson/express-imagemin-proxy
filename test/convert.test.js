const utils = require('./utils')
const images = require('./images')
const ImageminGm = require('imagemin-gm')
const imageminGm = new ImageminGm()
const fileType = require('file-type')

const convertToPng = [imageminGm.convert('png')].concat(utils.imageminPlugins)
const convertToJpg = [imageminGm.convert('jpg')].concat(utils.imageminPlugins)

describe('convert images', () => {
	// Waiting for https://github.com/imagemin/imagemin/issues/291
	test.skip('convert gif to png', done => {
		utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
			plugins: convertToPng,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
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
			plugins: convertToJpg,
		}, (err, env) => {
			if( err ) { return done(err) }

			utils.getAsBinary(env.app)
				.then(response => {
					expect(response.statusCode).toBe(200)
					expect(response.body.length).toBeGreaterThanOrEqual(images.tinyPng.length)
					expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'jpg')
					env.listen.close()
					done()
				})
		})
	})
})
