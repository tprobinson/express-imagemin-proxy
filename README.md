# express-imagemin-proxy

An Express middleware to serve up minified images retrieved from a backend.

[![https://nodei.co/npm/express-imagemin-proxy.svg?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/express-imagemin-proxy.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/express-imagemin-proxy)

[![Dependency Status](https://david-dm.org/tprobinson/express-imagemin-proxy.svg)](https://david-dm.org)
[![Coverage Status](https://coveralls.io/repos/github/tprobinson/express-imagemin-proxy/badge.svg?branch=master)](https://coveralls.io/github/tprobinson/express-imagemin-proxy?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/tprobinson/express-imagemin-proxy/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tprobinson/express-imagemin-proxy?targetFile=package.json)

master: [![Build Status](https://travis-ci.org/tprobinson/express-imagemin-proxy.svg?branch=master)](https://travis-ci.org/tprobinson/express-imagemin-proxy)
[![Inline docs](http://inch-ci.org/github/tprobinson/express-imagemin-proxy.svg?branch=master)](http://inch-ci.org/github/tprobinson/express-imagemin-proxy)


# Prerequisites

Your environment must have `imagemagick` and `graphicsmagick` available in the `$PATH`.

# Usage

First, instantiate the route. You must pass in two arguments: a backend function and an object of options.

The backend function is passed two arguments: the Express request object, and the Express response object. However, you can't just put an Express route here. This function is expected to return a Promise that resolves to a Buffer containing an image.

In the options, pass in any [Imagemin plugins](https://www.npmjs.com/search?q=keywords:imageminplugin) as an array called `plugins`.

```js
const fetch = require('node-fetch')
const express = require('express')
const app = express()
/* ... plugin requires go here ... */

const imageminProxy = new ImageminProxy((req, res) => {
	// Here's my backend function.
	// This is a very basic function that always returns the same image.
	return fetch('http://my.backend/folder/some-image.png')
		.then(x => x.ok ? x.buffer() : Promise.reject(x))
}, {
	plugins: [
		imageminPngQuant({quality: '45-80', strip: true, speed: 3}),
		imageminJpegOptim({max: 90}),
		imageminGifsicle({colors: 256, optimizationLevel: 3, interlaced: true}),
		imageminSvgo({plugins: [{removeViewBox: false}]}),
	]
})

app.use('/img', imageminProxy)

app.listen()
```

## Examples of Backend Functions

Act as a reverse proxy for some backend:
```js
const url = require('url')
const baseUrl = 'https://some-server-with-a-folder-of-images/imgSubfolder'
const myBackendFunc = (req, res) => {
	// Change the URL so that it's pointing to the other server's folder
	const cleanUrl = url.parse(baseUrl + req.url)

	// Clean out all the query parameters from it
	cleanUrl.search = ''

	return fetch(cleanUrl)
		.then(x => {
			if( !x.ok ) {
				return Promise.reject(x)
			}

			// Set the content type from the backend if there is one
			if( x.headers.has('content-type') ) {
				res.contentType(x.headers.get('content-type'))
			}

			return x.buffer()
		})
		.catch(err => {
			if( 'status' in err ) {
				// A Fetch error -- send it to the client
				res.status(err.status)
				res.send(err.statusText)
			}
			return Promise.reject(err)
		})
}
```

## Options

### plugins

Default: `[]`

Specify an array containing [Imagemin plugins](https://www.npmjs.com/search?q=keywords:imageminplugin) here. These will be used to minify any applicable images.

### guessFormat

Default: `true`

If this is true and the backend has not set `Content-Type` headers (or they are set to `application/octet-stream`), try to figure out what the response really is.

* If the `format` query parameter is specified, use that as a file extension for determining a MIME type.
* Otherwise, try to guess using [file-type](https://www.npmjs.com/package/file-type).

This is a useful option if you're not always certain what you're going to get, or for some reason the backend can't get file extensions on its own.

### graphicsmagickPath

Default: `undefined`

If GraphicsMagick is not in your `$PATH`, you will get an error like `Stream yields empty buffer` when attempting to resize or convert images. You can specify a directory containing the Graphicsmagick binaries (not the binary itself) here. See [imagemin-gm](https://www.npmjs.com/package/imagemin-gm) for more information.

### handleBlankResponse

Default: `404`

If this is a non-false value and the backend gives an empty response, send this HTTP code.

If this is a false value, throw a `EmptyResponseError` instead.

`EmptyResponseError` can be accessed at `imageminProxy.errors.EmptyResponseError` for type checking if desired.

# Query Parameters

If this route receives certain query parameters, it will pass those along to Imagemin.

Currently supported parameters:
* `width`: the width of the image as a number of pixels
* `height`: the height of the image as a number of pixels
* `gravity`: when resizing the image, what side of the image should be prioritized?

See [imagemin-gm](https://www.npmjs.com/package/imagemin-gm) for more information.

# Known Issues / TODO

- [ ] other GM functions?

# Development

Please use the included ESlint configuration to enforce style when developing. Use `yarn test --coverage` to run the linter and test suite as well as coverage before commits.

To generate documentation, use `yarn doc` or `yarn docdev`.

# License

[MIT](https://www.tldrlegal.com/l/mit)
