'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let registered;
let contentScript;

global.joplin = {
	plugins: {
		register: plugin => {
			registered = plugin;
		},
	},
	contentScripts: {
		register: async (...args) => {
			contentScript = args;
		},
	},
};

require('../src/index.js');

async function main() {
	assert.ok(registered, 'plugin must call joplin.plugins.register');
	await registered.onStart();
	assert.deepEqual(contentScript, ['markdownItPlugin', 'video-md', './videoMd.js']);
	assert.ok(fs.existsSync(path.join(__dirname, '..', 'src', 'videoMd.js')));
	console.log('register tests passed');
}

main().catch(error => {
	console.error(error);
	process.exit(1);
});
