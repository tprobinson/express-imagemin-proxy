const utils = require('./utils')
const images = require('./images')

describe('minify images', () => {
  test('get minified gif', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallGif.length)
    env.listen.close()
  })

  test('get minified jpeg', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallJpg), {
      plugins: utils.imageminPlugins,
    })
    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallJpg.length)
    env.listen.close()
  })

  test('get minified png', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })

  // Waiting for https://github.com/sindresorhus/is-svg/pull/18
  test.skip('get minified svg', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallSvg), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallSvg.length)
    env.listen.close()
  })

  test('get minified png with content-type preset', async () => {
    const env = await utils.createTestEnvironment(utils.serveBufferWithContentType(images.smallPng, 'image/png'), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })
})
