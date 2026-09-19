// Zero-dependency production build for the alSooq unified prototype.
// The pages are self-contained (CSS/JS/icons inlined per file), so the
// "build" collects everything a static host needs into ./dist:
//   - the root *.html pages
//   - the site/ reference prototypes (HTML + the pitch-deck PDF)
// Anything under node_modules, .git, dist, or scripts is left out.

import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

const EXCLUDE_TOP_LEVEL = new Set([
  'node_modules',
  '.git',
  'dist',
  'scripts',
  'package.json',
  'package-lock.json',
  '.prettierrc.json',
  '.prettierignore',
  '.htmlvalidate.json',
  '.gitignore',
]);

// File extensions that ship to the static host.
const SHIP_EXTENSIONS = ['.html', '.pdf', '.css', '.js', '.mjs', '.svg', '.png',
  '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.json', '.woff', '.woff2', '.ttf'];

function shouldShip(name) {
  return SHIP_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext));
}

async function copyTree(fromDir, toDir, copied) {
  const entries = await readdir(fromDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = join(fromDir, entry.name);
    const dest = join(toDir, entry.name);
    if (entry.isDirectory()) {
      await copyTree(src, dest, copied);
    } else if (entry.isFile() && shouldShip(entry.name)) {
      await mkdir(toDir, { recursive: true });
      await cp(src, dest);
      copied.push(relative(ROOT, dest));
    }
  }
}

async function main() {
  // Fresh output every time.
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const copied = [];

  // Root-level pages and assets.
  const rootEntries = await readdir(ROOT, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (EXCLUDE_TOP_LEVEL.has(entry.name)) continue;
    if (entry.name.startsWith('.')) continue; // dot-files/dirs (.claude, etc.)
    const src = join(ROOT, entry.name);
    const dest = join(DIST, entry.name);
    if (entry.isDirectory()) {
      await copyTree(src, dest, copied);
    } else if (entry.isFile() && shouldShip(entry.name)) {
      await cp(src, dest);
      copied.push(relative(ROOT, dest));
    }
  }

  // Ship the README so the deploy is self-describing.
  try {
    if ((await stat(join(ROOT, 'README.md'))).isFile()) {
      await cp(join(ROOT, 'README.md'), join(DIST, 'README.md'));
      copied.push('dist/README.md');
    }
  } catch {
    /* no README, fine */
  }

  const htmlCount = copied.filter((f) => f.endsWith('.html')).length;
  console.log(`Build complete → ${relative(ROOT, DIST)}/`);
  console.log(`  ${copied.length} files (${htmlCount} HTML pages)`);
  for (const file of copied.sort()) {
    console.log(`   • ${file}`);
  }

  await writeFile(
    join(DIST, 'build-manifest.json'),
    JSON.stringify(
      { builtAt: new Date().toISOString(), files: copied.sort() },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
