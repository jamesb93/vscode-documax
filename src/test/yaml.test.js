const YAML =require('YAML');
const fs = require('fs');
const assert = require('assert')

suite('YAML Testing', () => {
	// read in test file
	test('Test Parsing in VSCode', () => {
		const testInput = fs.readFileSync('src/test/testin.yaml', 'utf8');
		const parsed = YAML.parse(testInput);
		console.log(parsed)
		assert(parsed.attributes[0].name === 'a1');
		assert(parsed.attributes[0].name !== '0');
	});
});