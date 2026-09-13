const { execFileSync } = require('node:child_process');
const { cpSync, rmSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
// Build beside the source so React cannot resolve through deployment dependencies.
execFileSync(process.execPath, [require.resolve('next/dist/bin/next'), 'build', 'src/app', '--webpack'], {
  cwd: root, stdio: 'inherit'
});
const output = path.join(root, 'dist/functions/.next');
rmSync(output, { recursive: true, force: true });
cpSync(path.join(root, 'src/app/.next'), output, { recursive: true });
