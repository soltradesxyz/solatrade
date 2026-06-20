const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`  copied ${path.basename(src)}`);
}

function build() {
  console.log('\n  Building SolTrades...\n');
  const start = Date.now();

  ensureDir(DIST);
  ensureDir(path.join(DIST, 'assets'));

  const root = path.join(__dirname, '..');

  copyFile(path.join(root, 'index.html'), path.join(DIST, 'index.html'));
  copyFile(path.join(root, 'vercel.json'), path.join(DIST, 'vercel.json'));

  if (fs.existsSync(path.join(root, 'noir.js'))) {
    copyFile(path.join(root, 'noir.js'), path.join(DIST, 'noir.js'));
  }

  const elapsed = Date.now() - start;
  console.log(`\n  Build complete in ${elapsed}ms\n`);
}

build();
