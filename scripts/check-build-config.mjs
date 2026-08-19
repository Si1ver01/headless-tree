import { readFile } from 'node:fs/promises';

const prefix = '[FIX:typescript-6-dts]';
const config = JSON.parse(await readFile(new URL('../tsconfig.app.json', import.meta.url), 'utf8'));
const TypeScriptMajor = Number.parseInt(
  JSON.parse(
    await readFile(new URL('../node_modules/typescript/package.json', import.meta.url), 'utf8'),
  ).version,
  10,
);

if (TypeScriptMajor >= 6 && config.compilerOptions?.ignoreDeprecations !== '6.0') {
  console.error(
    JSON.stringify({
      level: 'ERROR',
      message: `${prefix} TypeScript 6 DTS compatibility setting is missing`,
      typescriptMajor: TypeScriptMajor,
    }),
  );
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify({
      level: 'INFO',
      message: `${prefix} build configuration is compatible`,
      typescriptMajor: TypeScriptMajor,
      ignoreDeprecations: config.compilerOptions?.ignoreDeprecations ?? null,
    }),
  );
}
