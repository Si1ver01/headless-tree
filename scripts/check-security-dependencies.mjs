import { execFileSync } from 'node:child_process';

try {
  execFileSync('npm', ['audit', '--omit=dev', '--audit-level=high'], { stdio: 'inherit' });
  execFileSync('npm', ['ls', '--all', '--json'], { stdio: 'ignore' });
  console.log(JSON.stringify({ stage: 'security-check', level: 'INFO', message: 'production dependencies are clean' }));
} catch (error) {
  console.error(JSON.stringify({ stage: 'security-check', level: 'ERROR', message: 'dependency security gate failed', code: error?.status ?? 1 }));
  process.exitCode = 1;
}
