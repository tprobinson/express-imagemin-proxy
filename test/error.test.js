const utils = require('./utils')
const images = require('./images')

describe('erroneous usage', () => {
  test('404 when provided nothing', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(), {
      plugins: [],
    })

    const response = await utils.get(env.app)
    expect(response.statusCode).toBe(404)
    env.listen.close()
  })

  test('error when provided nothing with error option', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(), {
      plugins: utils.imageminPlugins,
      handleBlankResponse: false,
    })

    const response = await utils.get(env.app)
    expect(response.statusCode).toBe(500)
    expect(response.type).toBe('text/html')
    env.listen.close()
  })

  test('error with bogus format conversion', async () => {
    const env = await utils.createTestEnvironment(utils.serveBuffer(images.smallPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.getPathAsBinary(env.app, '/?format=pingpong')
    expect(response.statusCode).toBe(500)
    expect(response.type).toBe('text/html')
    env.listen.close()
  })

  test('no imagemin happens when backend sends response by itself', async () => {
    const env = await utils.createTestEnvironment(utils.serveBufferWrongly(images.smallPng), {
      plugins: utils.imageminPlugins,
    })

    const response = await utils.get(env.app)
    expect(response.statusCode).toBe(200)
    expect(response.type).toBe('text/html')
    expect(response.text).toBe('Oops')
    env.listen.close()
  })
})
