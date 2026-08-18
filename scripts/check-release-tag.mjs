import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = execFileSync('git', ['describe', '--tags', '--exact-match'], { encoding: 'utf8' }).trim();
if (tag !== `v${pkg.version}`) throw new Error(`tag ${tag || 'none'} does not match package version ${pkg.version}`);
console.log(JSON.stringify({ stage: 'release-check', level: 'INFO', tag, version: pkg.version }));
