const { cpSync, mkdirSync, rmSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = name => path.join(root, name);
switch (process.argv[2]) {
  case 'clean':
    for (const dir of ['dist/functions', 'dist/public', 'src/app/.next']) {
      rmSync(target(dir), { recursive: true, force: true });
    }
    break;
  case 'public':
    mkdirSync(target('dist/public'), { recursive: true });
    cpSync(target('src/public'), target('dist/public'), { recursive: true });
    break;
  case 'deps':
    mkdirSync(target('dist/functions'), { recursive: true });
    for (const file of ['package.json', 'package-lock.json']) {
      cpSync(target(file), target(`dist/functions/${file}`));
    }
    break;
  default:
    throw new Error('Expected clean, public or deps');
}
