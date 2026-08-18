import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const files = ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CHANGELOG.md', 'RELEASE_NOTES.md'];
for (const file of files) await access(join(root, file));
const readme = await readFile(join(root, 'README.md'), 'utf8');
if (!readme.includes('useTree')) throw new Error('README must document useTree');
const asyncDocs = await readFile(join(root, 'docs/async-loading.md'), 'utf8');
if (!asyncDocs.includes('TREE_CHILDREN_LOAD_FAILED')) {
  throw new Error('async loading docs must document the client-safe error contract');
}
console.log(
  JSON.stringify({
    stage: 'docs-check',
    level: 'INFO',
    files: files.length,
    message: 'documentation baseline passed',
  }),
);
