'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const tar = require('tar');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const publishDir = path.join(rootDir, 'publish');

const pluginFiles = ['manifest.json', 'index.js', 'videoMd.js'];

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, '\t')}\n`);
}

function gitHead() {
	try {
		return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
	} catch {
		return '';
	}
}

async function main() {
	const manifest = readJson(path.join(srcDir, 'manifest.json'));
	const packageJson = readJson(path.join(rootDir, 'package.json'));

	if (!packageJson.name.startsWith('joplin-plugin-')) {
		throw new Error('package.json name must start with "joplin-plugin-"');
	}
	if (packageJson.version !== manifest.version) {
		throw new Error(`Version mismatch: package.json ${packageJson.version}, manifest.json ${manifest.version}`);
	}
	if (!/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(manifest.repository_url || '')) {
		throw new Error('manifest.json repository_url must be a GitHub repository URL');
	}

	fs.rmSync(distDir, { recursive: true, force: true });
	fs.rmSync(publishDir, { recursive: true, force: true });
	fs.mkdirSync(distDir, { recursive: true });
	fs.mkdirSync(publishDir, { recursive: true });

	for (const file of pluginFiles) {
		fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
	}

	const jplPath = path.join(publishDir, `${manifest.id}.jpl`);
	await tar.create({
		file: jplPath,
		cwd: distDir,
		portable: true,
		strict: true,
	}, pluginFiles);

	const hash = crypto.createHash('sha256').update(fs.readFileSync(jplPath)).digest('hex');
	const commit = gitHead();
	const info = {
		...manifest,
		_publish_hash: `sha256:${hash}`,
	};
	if (commit) info._publish_commit = commit;

	const infoPath = path.join(publishDir, `${manifest.id}.json`);
	writeJson(infoPath, info);

	const jplCount = fs.readdirSync(publishDir).filter(f => f.endsWith('.jpl')).length;
	const jsonCount = fs.readdirSync(publishDir).filter(f => f.endsWith('.json')).length;
	if (jplCount !== 1 || jsonCount !== 1) {
		throw new Error(`Expected exactly one .jpl and one .json in publish/, got ${jplCount} and ${jsonCount}`);
	}

	console.log(`Built ${path.relative(rootDir, jplPath)}`);
	console.log(`Built ${path.relative(rootDir, infoPath)}`);
}

main().catch(error => {
	console.error(error.message);
	process.exit(1);
});
