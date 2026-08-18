import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const files = ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CHANGELOG.md', 'RELEASE_NOTES.md'];
for (const file of files) await access(join(root, file));
const readme = await readFile(join(root, 'README.md'), 'utf8');
if (!readme.includes('useTree')) throw new Error('README must document useTree');
console.log(JSON.stringify({ stage: 'docs-check', level: 'INFO', files: files.length, message: 'documentation baseline passed' }));
