const ImageminProxy = require('../src/index.js')

describe('class construction options', () => {
	test('can instantiate class', () => {
		const proxy = new ImageminProxy(() => {})
		expect(proxy).toEqual(expect.any(Function))
	})

	test('can add options to constructor', () => {
		const proxy = new ImageminProxy(() => {}, {guessFormat: false})
		expect(proxy).toEqual(expect.any(Function))
	})

	test('construction fails without required parameters', () => {
		expect(() => new ImageminProxy()).toThrow()
	})

	test('construction fails with incorrect parameters', () => {
		expect(() => new ImageminProxy(true)).toThrow()
	})
})
