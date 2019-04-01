const utils = require('./utils')
const images = require('./images')

describe('resize images', () => {
  test('resize 2x2 gif to 1x1', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
      plugins: [],
    })

    const response = await utils.getPathAsBinary(env.app, '?width=1&height=1')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallGif.length)
    env.listen.close()
  })

  test('resize 2x2 jpg to 1x1', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallJpg), {
      plugins: [],
    })

    const response = await utils.getPathAsBinary(env.app, '?width=1&height=1')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallJpg.length)
    env.listen.close()
  })

  test('resize 2x2 png to 1x1', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: [],
    })

    const response = await utils.getPathAsBinary(env.app, '?width=1&height=1')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })

  test('resize 2x2 png to 1x1 with gravity', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: [],
    })

    const response = await utils.getPathAsBinary(env.app, '?width=1&height=1&gravity=south')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    env.listen.close()
  })
})
