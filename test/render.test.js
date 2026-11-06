'use strict';

const assert = require('node:assert/strict');
const MarkdownIt = require('markdown-it');
const contentScript = require('../dist/videoMd.js');

const setup = contentScript.default({});

function render(markdown) {
	const markdownIt = new MarkdownIt({ html: true });
	setup.plugin(markdownIt);
	return markdownIt.render(markdown);
}

const remoteVideo = render('![clip](http://qnap.elf-balance.ts.net:7658/file/1789696504412_lightamer-20260916-04.mp4)');
assert.match(
	remoteVideo,
	/<video controls preload="metadata" style="max-width:100%" src="http:\/\/qnap\.elf-balance\.ts\.net:7658\/file\/1789696504412_lightamer-20260916-04\.mp4">clip<\/video>/,
);

const hashVideo = render('![clip](https://cdn.example.com/a.mp4#t=30,60)');
assert.match(hashVideo, /<video[^>]+src="https:\/\/cdn\.example\.com\/a\.mp4#t=30,60"/);

const image = render('![img](https://cdn.example.com/a.png)');
assert.match(image, /<img src="https:\/\/cdn\.example\.com\/a\.png" alt="img">/);
assert.doesNotMatch(image, /<video/);

const escaped = render('![x](https://cdn.example.com/a.mp4?x=1&y=2)');
assert.match(escaped, /src="https:\/\/cdn\.example\.com\/a\.mp4\?x=1&amp;y=2"/);

console.log('render tests passed');
