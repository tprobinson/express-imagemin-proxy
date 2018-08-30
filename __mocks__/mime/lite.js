module.exports = require.requireActual('mime/lite')
const realGetType = module.exports.getType
module.exports.getType = function fakeGetType (...args) {
	if( process.env.DUMB_MIME ) {
		return undefined
	}
	return realGetType.call(this, ...args)
}
