// Zero-dependency static dev server for the alSooq unified prototype.
// Serves the repository root (HTML + site/) on http://localhost:3000.
// No build step and no runtime dependencies — matches the project's
// "self-contained, inlined per file" approach.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';

// Landing page is the public entry point; index.html is the app router.
const DEFAULT_DOCUMENT = 'landing.html';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function contentType(filePath) {
  return MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
}

// Resolve a request path to a real file inside ROOT, refusing traversal.
function resolveWithinRoot(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const relative = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const resolved = join(ROOT, relative);
  if (resolved !== ROOT.replace(/[/\\]$/, '') && !resolved.startsWith(ROOT)) {
    return null; // escaped the root
  }
  return resolved;
}

async function readableFile(candidate) {
  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
    if (info.isDirectory()) {
      const indexed = join(candidate, DEFAULT_DOCUMENT);
      const alt = join(candidate, 'index.html');
      for (const file of [indexed, alt]) {
        try {
          if ((await stat(file)).isFile()) return file;
        } catch {
          /* keep looking */
        }
      }
    }
  } catch {
    /* not found */
  }
  return null;
}

const server = createServer(async (req, res) => {
  const target = req.url === '/' ? `/${DEFAULT_DOCUMENT}` : req.url;
  const resolved = resolveWithinRoot(target);

  if (!resolved) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  const file = await readableFile(resolved);

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 — not found</h1><p>Try <a href="/">the landing page</a>.</p>');
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': contentType(file),
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`500 — ${err.message}`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set PORT=<other> and retry.`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  const shown = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`alSooq dev server → http://${shown}:${PORT}/`);
  console.log(`Serving ${ROOT.replace(new RegExp(`${sep}$`), '')}`);
  console.log('Press Ctrl+C to stop.');
});
