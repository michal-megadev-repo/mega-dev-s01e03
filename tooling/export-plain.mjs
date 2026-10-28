import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const route = '/kb/decisions/0002-review-4471';
const manifest = JSON.parse(await readFile('render-manifest.json', 'utf8'));
const page = manifest.pages.find(page => page.route === route);
assert(page?.signature && page?.deskRef, 'The source page must be signed and rendered');
const html = await readFile(`dist${route}/index.html`, 'utf8');

// Preserve the actual SSR content, inline CSS and SVG; this review needs no JavaScript.
const plain = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/href="(\/kb[^"#]*)(#[^"]*)?"/g, (_match, route, fragment = '') => {
    const sourcePath = `src/routes${route}/+page.svx`;
    const encoded = sourcePath.split('/').map(encodeURIComponent).join('/');
    return `href="https://github.com/michal-megadev-repo/mega-dev-s01e03/blob/main/${encoded}${fragment}"`;
  });

assert(plain.startsWith('<!doctype html>'), 'Expected a complete HTML document');
assert(plain.includes('<style') && plain.includes('<svg'), 'Keep the real styles and chart');
assert(plain.includes(page.deskRef), 'Keep the computed RenderStamp');
assert(!/<script\b|<link\b[^>]*stylesheet|(?:src|href)="\/(?!\/)/i.test(plain),
  'The standalone page must not require scripts, stylesheets or local URLs');
await writeFile('index.html', plain, 'utf8');
console.log(JSON.stringify({ output: 'index.html', bytes: Buffer.byteLength(plain),
  signature: page.signature, deskRef: page.deskRef, scripts: 0, externalAssets: 0 }));
