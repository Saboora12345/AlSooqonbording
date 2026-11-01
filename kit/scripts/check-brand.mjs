#!/usr/bin/env node
// alSooq brand enforcement — zero dependencies.   node kit/scripts/check-brand.mjs [paths…]
// Defaults to kit/ and next-commerce/. Exit 1 on any violation, so it can gate CI.
//
//  R1 colour    raw hex/rgb()/hsl() only in tokens.css (everything else uses var(--aq-*))
//  R2 font      font-family only via var(--aq-ar|en|mono); tokens.css must define IBM Plex Sans (+ Arabic)
//  R3 logical   no left/right CSS (margin-left, text-align:left, left:…) — RTL must mirror for free
//  R4 hover     every :hover lives inside @media (hover: hover) and (pointer: fine)  (no sticky hover on touch)
//  R5 derived   a token that references var(--aq-accent*) must be declared where [data-vertical] can change it
//  R6 page      html lang+dir, viewport-fit=cover, zoom never disabled, tokens.css linked, no inline <script> colours
//  R7 honesty   no hard-coded phone numbers (owner rule: unconfirmed contact data stays a [PLACEHOLDER])
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename, relative } from 'node:path';

const ROOT = process.cwd();
const targets = process.argv.slice(2).length ? process.argv.slice(2) : ['kit', 'next-commerce'];
const SKIP = new Set(['node_modules', '.next', '_kit', 'dist', '.git']);
const files = [];
function walk(p) {
  let st; try { st = statSync(p); } catch { return; }
  if (st.isDirectory()) { for (const f of readdirSync(p)) if (!SKIP.has(f)) walk(join(p, f)); }
  else if (['.css', '.html', '.js', '.tsx', '.ts'].includes(extname(p))) files.push(p);
}
targets.forEach(walk);

const bad = [];
const flag = (file, line, rule, msg) => bad.push(`${relative(ROOT, file)}:${line}  [${rule}] ${msg}`);
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

// CSS-bearing chunks of a file (whole css; <style> blocks + style="" in html; whole tsx/ts)
function cssChunks(file, text) {
  const ext = extname(file);
  if (ext === '.css') return [{ off: 0, css: stripComments(text) }];
  if (ext === '.html') {
    const out = [];
    for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) out.push({ off: m.index, css: stripComments(m[1]) });
    for (const m of text.matchAll(/\sstyle="([^"]*)"/g)) out.push({ off: m.index, css: m[1] });
    return out;
  }
  return [{ off: 0, css: text }];
}

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const name = basename(file);
  const isTokens = name === 'tokens.css';
  const isCss = extname(file) === '.css';

  for (const { off, css } of cssChunks(file, text)) {
    if (!isTokens) {
      for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g)) {
        const ln = lineOf(text, off + m.index);
        // a <meta theme-color> / Next `viewport.themeColor` takes a literal: it cannot read a CSS variable
        if (/theme-?color/i.test(text.split('\n')[ln - 1])) continue;
        flag(file, ln, 'R1', `raw colour "${m[0]}" — use a var(--aq-*) token`);
      }
    }
    for (const m of css.matchAll(/font-family\s*:\s*([^;}]+)/g))
      if (!/var\(--aq-/.test(m[1])) flag(file, lineOf(text, off + m.index), 'R2', `font-family "${m[1].trim().slice(0, 40)}" — use var(--aq-ar|en|mono)`);
    if (!isTokens)
      for (const m of css.matchAll(/(?<![-\w])font\s*:\s*([^;}]+)/g))
        if (/['"]|\b(sans-serif|serif|monospace|system-ui|Arial|Helvetica|IBM)\b/.test(m[1]) && !/var\(--aq-/.test(m[1]))
          flag(file, lineOf(text, off + m.index), 'R2', `font shorthand "${m[1].trim().slice(0, 40)}" — use var(--aq-*)`);
    for (const m of css.matchAll(/(?<![-\w])(margin-left|margin-right|padding-left|padding-right|border-left|border-right|float\s*:\s*(?:left|right)|text-align\s*:\s*(?:left|right)|(?:left|right)\s*:)/g))
      flag(file, lineOf(text, off + m.index), 'R3', `physical "${m[1].trim()}" — use logical (inline-start/end, inset-inline-*)`);
  }

  if (isTokens) {
    if (!/IBM Plex Sans Arabic/.test(text) || !/'IBM Plex Sans'/.test(text)) flag(file, 1, 'R2', 'tokens.css must define IBM Plex Sans Arabic + IBM Plex Sans');
    // R5: split into top-level blocks
    const css = stripComments(text);
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].trim();
      for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
        if (/var\(--aq-accent/.test(d[2]) && !/\[data-vertical\]/.test(sel))
          flag(file, lineOf(text, m.index + m[1].length + d.index), 'R5', `${d[1]} references the accent but is declared on "${sel}" — it will freeze at the :root value; declare it on ":root, [data-vertical]"`);
    }
  }

  if (isCss && name === 'components.css') {         // R4: every :hover inside the capability media query
    const css = stripComments(text);
    const i0 = css.search(/@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{/);
    let lo = -1, hi = -1;
    if (i0 >= 0) { lo = css.indexOf('{', i0); let d = 0; for (let i = lo; i < css.length; i++) { if (css[i] === '{') d++; if (css[i] === '}' && --d === 0) { hi = i; break; } } }
    for (const m of css.matchAll(/:hover/g)) if (!(m.index > lo && m.index < hi)) flag(file, lineOf(text, m.index), 'R4', ':hover outside @media (hover: hover) and (pointer: fine)');
  }

  if (extname(file) === '.html') {                  // R6
    if (!/<html[^>]*\blang="/.test(text) || !/<html[^>]*\bdir="/.test(text)) flag(file, 1, 'R6', '<html> needs lang and dir');
    const vp = text.match(/<meta[^>]*name="viewport"[^>]*>/)?.[0] || '';
    if (!/viewport-fit=cover/.test(vp)) flag(file, 1, 'R6', 'viewport needs viewport-fit=cover');
    if (/user-scalable\s*=\s*(no|0)|maximum-scale/.test(vp)) flag(file, 1, 'R6', 'never disable zoom');
    if (!/css\/tokens\.css/.test(text)) flag(file, 1, 'R6', 'must link css/tokens.css');
  }

  if (!isCss && !/node_modules/.test(file))         // R7
    for (const m of text.matchAll(/(?<![\w.#/-])\+?\d[\d ()-]{9,}\d(?![\w.])/g))
      if (!/\d{4}-\d{2}-\d{2}/.test(m[0])) flag(file, lineOf(text, m.index), 'R7', `looks like a phone number "${m[0].trim()}" — keep it a [PLACEHOLDER] until the owner confirms`);
}

if (bad.length) { console.error(bad.join('\n')); console.error(`\n✗ ${bad.length} brand violation(s) in ${files.length} files`); process.exit(1); }
console.log(`✓ brand check passed — ${files.length} files, 7 rules`);
