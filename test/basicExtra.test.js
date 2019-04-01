const utils = require('./utils')
const images = require('./images')
const fileType = require('file-type')

describe('options', () => {
  test('get minified png with content-type preset', async () => {
    const env = await utils.createTestEnvironment(utils.serveBufferWithContentType(images.smallPng, 'image/png'), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })

  test('get minified png without guessing format', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: utils.imageminPlugins,
      guessFormat: false,
    })

    const response = await utils.getAsBinary(env.app)

    expect(response.statusCode).toBe(200)
    expect(response.type).toBe('application/octet-stream')
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })
})

describe('unusual edge cases', () => {
  test('graphicsmagick converts to a format that MIME is unaware of', async () => {
    process.env.DUMB_MIME = true
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getPathAsBinary(env.app, '/?format=gif')

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'gif')
    env.listen.close()
    delete process.env.DUMB_MIME
  })
})
