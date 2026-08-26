const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==> Building frontend with craco...');
execSync('yarn --cwd frontend build', { stdio: 'inherit' });

const src = path.join(__dirname, 'frontend', 'build');
const dest = path.join(__dirname, 'build');

console.log(`==> Copying build output from ${src} to ${dest}...`);
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
fs.cpSync(src, dest, { recursive: true, force: true });

if (fs.existsSync(path.join(dest, 'index.html'))) {
  console.log('==> SUCCESS: Root build directory created and verified with index.html!');
} else {
  console.error('==> ERROR: index.html not found in destination build directory!');
  process.exit(1);
}
