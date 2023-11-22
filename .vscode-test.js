const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({ files: 'src/test/*.test.js' });