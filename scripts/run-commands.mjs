import { spawn } from 'node:child_process';
import process from 'node:process';

const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
const configured = String(
  process.env.LOG_LEVEL ?? (process.env.DEBUG ? 'DEBUG' : 'INFO'),
).toUpperCase();
const level = levelNames.includes(configured) ? configured : 'INFO';
if (configured !== level && configured !== '') {
  console.warn('[run-commands] WARN unsupported LOG_LEVEL; using INFO');
}

function log(name, message, data = {}) {
  const record = { stage: name, message, ...data };
  if (name === 'DEBUG' && level !== 'DEBUG') return;
  process.stderr.write(`${JSON.stringify(record)}\n`);
}

const [, , stage = 'command', ...commandParts] = process.argv;
const groups = commandParts
  .join(' ')
  .split(' ::: ')
  .map((part) => part.trim())
  .filter(Boolean);
if (groups.length === 0) process.exit(2);

const run = (command) =>
  new Promise((resolve) => {
    const [executable, ...args] = command.split(/\s+/);
    const started = Date.now();
    log('DEBUG', 'start', {
      executable,
      args: args.map((arg) => arg.replace(/(token|secret|password)=\S+/gi, '$1=[redacted]')),
    });
    const child = spawn(executable, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('close', (code, signal) => {
      const exitCode = code ?? 1;
      log(exitCode === 0 ? 'INFO' : 'ERROR', 'complete', {
        command: executable,
        exitCode,
        signal,
        durationMs: Date.now() - started,
      });
      resolve(exitCode);
    });
  });

for (const command of groups) {
  const code = await run(command);
  if (code !== 0) process.exit(code);
}
log('INFO', 'stage-complete', { stage, commands: groups.length });
