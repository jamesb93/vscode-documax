import * as assert from 'assert';
import * as vscode from 'vscode';
import { objects, messages, attributes, links } from '../markdownExtensions';

interface Token {
	text: string
	tokens: Array<any>
}

suite('Markdown Extension Test Suite', () => {
	test('objects', () => {
		const src = '@o myObject';
		const tokens: Array<string> = [];
		const token: Token|undefined = objects.tokenizer(src, tokens);
		assert.strictEqual(token.text, 'myObject');
		assert.strictEqual(token.tokens[0].text, 'myObject');
	});

	test('messages', () => {
		const src = '@m myMessage';
		const tokens: Array<string> = [];
		const token: Token|undefined = messages.tokenizer(src, tokens);
		assert.strictEqual(token.text, 'myMessage');
		assert.strictEqual(token.tokens[0].text, 'myMessage');
	});

	test('attributes', () => {
		const src = '@a myAttribute';
		const tokens: Array<string> = [];
		const token: Token|undefined = attributes.tokenizer(src, tokens);
		assert.strictEqual(token.text, 'myAttribute');
		assert.strictEqual(token.tokens[0].text, 'myAttribute');
	});

	test('links', () => {
		const src = '{myLink}(https://www.google.com)';
		const tokens = [];
		const token: Token|undefined = links.tokenizer(src, tokens);
		assert.strictEqual(token.text, 'myLink');
		assert.strictEqual(token.tokens[0].text, 'myLink');
		assert.strictEqual(token.tokens[0].url, 'https://www.google.com');
	});
});

