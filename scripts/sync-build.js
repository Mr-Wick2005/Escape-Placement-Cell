const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const buildDir = path.resolve(__dirname, '..', 'build');

if (fs.existsSync(distDir)) {
  fs.cpSync(distDir, buildDir, { recursive: true, force: true });
  console.log('✓ Successfully synchronized dist/ to build/ for zero-config Vercel deployment.');
} else {
  console.warn('⚠️ Warning: dist/ directory not found before sync.');
}
