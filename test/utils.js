const ImageminProxy = require('../src/index.js')
const express = require('express')
const request = require('supertest')

const binaryParser = (res, callback) => {
  res.setEncoding('binary')
  res.data = ''
  res.on('data', function (chunk) {
    res.data += chunk
  })
  res.on('end', function () {
    callback(null, Buffer.from(res.data, 'binary'))
  })
}

const serveBuffer = whichBuffer => async () => whichBuffer
const serveBufferWithContentType =
  (whichBuffer, contentType) =>
    async (req, res) => {
      res.contentType(contentType)
      return whichBuffer
    }
const serveBufferWrongly =
  whichBuffer =>
    async (req, res) => {
      res.send('Oops').end()
      return whichBuffer
    }

const imageminPngQuant = require('imagemin-pngquant')
const imageminJpegOptim = require('imagemin-jpegoptim')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminSvgo = require('imagemin-svgo')

const pngOptions = {quality: '45-80', strip: true, speed: 3}
const jpegOptions = {max: 90}
const gifOptions = {colors: 256, optimizationLevel: 3, interlaced: true}
const svgoPlugins = [{
  cleanupAttrs: true,
}, {
  removeDoctype: true,
}, {
  removeXMLProcInst: true,
}, {
  removeComments: true,
}, {
  removeMetadata: true,
}, {
  removeTitle: true,
}, {
  removeDesc: true,
}, {
  removeUselessDefs: true,
}, {
  removeEditorsNSData: true,
}, {
  removeEmptyAttrs: true,
}, {
  removeHiddenElems: true,
}, {
  removeEmptyText: true,
}, {
  removeEmptyContainers: true,
}, {
  removeViewBox: true,
}, {
  removeXMLNS: true,
}, {
  cleanupEnableBackground: true,
}, {
  convertStyleToAttrs: true,
}, {
  convertColors: true,
}, {
  convertPathData: true,
}, {
  convertTransform: true,
}, {
  removeUnknownsAndDefaults: true,
}, {
  removeNonInheritableGroupAttrs: true,
}, {
  removeUselessStrokeAndFill: true,
}, {
  removeUnusedNS: true,
}, {
  cleanupIDs: true,
}, {
  cleanupNumericValues: true,
}, {
  moveElemsAttrsToGroup: true,
}, {
  moveGroupAttrsToElems: true,
}, {
  collapseGroups: true,
}, {
  removeRasterImages: false,
}, {
  mergePaths: true,
}, {
  convertShapeToPath: true,
}, {
  sortAttrs: true,
}, {
  removeDimensions: true,
}, {
  removeAttrs: {attrs: '(stroke|fill)'},
}]

const svgOptions = {plugins: svgoPlugins}

const imageminPlugins = [
  imageminPngQuant(pngOptions),
  imageminJpegOptim(jpegOptions),
  imageminGifsicle(gifOptions),
  imageminSvgo(svgOptions),
]

module.exports = {
  binaryParser,
  serveBuffer,
  serveBufferWithContentType,
  serveBufferWrongly,
  imageminPlugins,

  get: app => request(app).get('/'),
  getPath: (app, path) => request(app).get(path),
  getAsBinary: app => request(app).get('/').buffer().parse(binaryParser),
  getPathAsBinary: (app, path) => request(app).get(path).buffer().parse(binaryParser),
  createTestEnvironment: (backend, options, cb) => {
    const proxyMiddleware = new ImageminProxy(backend, options)

    const app = express()
    app.use('*', proxyMiddleware)

    let listen
    return new Promise(resolve => {
      listen = app.listen(() => resolve({app, proxyMiddleware, listen}))
    })
  },
}
