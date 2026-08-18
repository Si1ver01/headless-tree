import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = process.cwd();
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const temp = await mkdtemp(join(tmpdir(), 'headless-tree-pack-'));
try {
  const { stdout } = await exec('npm', ['pack', '--dry-run', '--json'], { cwd: root });
  const [summary] = JSON.parse(stdout);
  const files = summary?.files?.map(({ path }) => path) ?? [];
  const forbidden = files.filter((file) =>
    /(^|\/)(tests?|\.env|node_modules)(\/|$)|\.map$/.test(file),
  );
  if (forbidden.length > 0) throw new Error(`forbidden package files: ${forbidden.join(', ')}`);
  for (const required of [
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.d.ts',
    'README.md',
    'LICENSE',
  ]) {
    if (!files.includes(required)) throw new Error(`missing package file: ${required}`);
  }
  await writeFile(
    join(temp, 'summary.json'),
    JSON.stringify({ name: pkg.name, version: pkg.version, files }, null, 2),
  );
  process.stdout.write(
    JSON.stringify({ name: pkg.name, version: pkg.version, files: files.length }) + '\n',
  );
} catch (error) {
  console.error(
    JSON.stringify({
      stage: 'pack-check',
      level: 'ERROR',
      message: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exitCode = 1;
} finally {
  await rm(temp, { recursive: true, force: true });
}
