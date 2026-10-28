import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { routes, renderPage } = await server.ssrLoadModule('/tooling/entry-server.js');
  const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
  const entry = manifest['tooling/entry-client.js'];
  if (!entry?.file) throw new Error('Client entry missing in Vite manifest');
  const results = [];
  for (const route of routes) {
    const result = renderPage(route);
    if (!result.body || !result.head) throw new Error(`Empty render for ${route}`);
    const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${result.head}</head><body><div id="app">${result.body}</div><script type="module" src="/${entry.file}"></script></body></html>\n`;
    const directory = path.join('dist', route);
    await mkdir(directory, { recursive: true });
    const output = path.join(directory, 'index.html');
    await writeFile(output, html, 'utf8');
    results.push({ route, output, title: result.metadata?.title, signature: result.metadata?.signature ?? null, deskRef: html.match(/desk ref\s*<b[^>]*>([^<]+)<\/b>/)?.[1] ?? null });
  }
  await writeFile('dist/index.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/kb"></head><body><a href="/kb">Support knowledge base</a></body></html>\n');
  await writeFile('render-manifest.json', JSON.stringify({ renderedAt: new Date().toISOString(), pages: results }, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
} finally {
  await server.close();
}
