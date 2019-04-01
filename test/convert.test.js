const utils = require('./utils')
const images = require('./images')
const fileType = require('file-type')

describe('convert images', () => {
  test('convert gif to png', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallGif), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getPathAsBinary(env.app, '/?format=png')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThanOrEqual(images.smallGif.length)
    expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'png')
    env.listen.close()
  })

  test('convert png to jpg', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.tinyPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getPathAsBinary(env.app, '/?format=jpg')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThanOrEqual(images.tinyPng.length)
    expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'jpg')
    env.listen.close()
  })

  test('convert png to gif', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getPathAsBinary(env.app, '/?format=gif')
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeLessThan(images.smallPng.length)
    expect(fileType(response.body.slice(0, 4101))).toHaveProperty('ext', 'gif')
    env.listen.close()
  })
})
