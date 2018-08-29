const fs = require('fs')
const path = require('path')

const basePath = path.resolve(path.join(__dirname, 'images'))

// Create a hash of all test files, camelcased
const files = {}
fs.readdirSync(basePath).forEach(filename => {
	const parsed = path.parse(filename)
	const key = parsed.name + parsed.ext.slice(1, 2).toUpperCase() + parsed.ext.slice(2)
	files[key] = fs.readFileSync(path.join(basePath, parsed.base))
})

module.exports = files
