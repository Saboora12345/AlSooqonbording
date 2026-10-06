// Single source of truth = ../kit. This copies the shared CSS and evaluates kit/js/sample-data.js into JSON
// so the React app and the static HTML kit can never drift. Runs automatically before dev/build/typecheck.
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';

const here = fileURLToPath(new URL('.', import.meta.url));
const kit = join(here, '..', '..', 'kit');
const out = join(here, '..', 'app', '_kit');
if (!existsSync(join(kit, 'css', 'tokens.css'))) {
  console.error(`sync-kit: cannot find ${kit}/css/tokens.css.\n` +
    'On Vercel set Root Directory = next-commerce and keep "Include source files outside of the Root Directory" enabled.');
  process.exit(1);
}
mkdirSync(out, { recursive: true });
for (const f of ['tokens.css', 'base.css', 'components.css']) cpSync(join(kit, 'css', f), join(out, f));
// In a browser `window` IS the global object, so the file's bare `AQ` resolves after `window.AQ = …`. Mirror that.
const ctx = {}; ctx.window = ctx;
vm.runInNewContext(readFileSync(join(kit, 'js', 'sample-data.js'), 'utf8'), ctx);
writeFileSync(join(out, 'sample.json'), JSON.stringify(ctx.AQ.sample, null, 2));
console.log('sync-kit: tokens + base + components css and sample.json synced from ../kit');
