const utils = require('./utils')
const images = require('./images')

describe('minified images are not changed', () => {
  test('get minified gif', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.tinyGif), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(images.tinyGif.length)
    expect(response.body).toEqual(images.tinyGif)
    env.listen.close()
  })

  test('get minified jpeg', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.tinyJpg), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(images.tinyJpg.length)
    expect(response.body).toEqual(images.tinyJpg)
    env.listen.close()
  })

  test('get minified png', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.tinyPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(images.tinyPng.length)
    expect(response.body).toEqual(images.tinyPng)
    env.listen.close()
  })

  test('get minified svg', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.tinySvg), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getAsBinary(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(images.tinySvg.length)
    expect(response.body).toEqual(images.tinySvg)
    env.listen.close()
  })
})
