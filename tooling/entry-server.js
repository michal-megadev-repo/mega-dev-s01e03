import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
export const routes = Object.keys(pages).map((path) => path.replace('/src/routes', '').replace('/+page.svx', ''));

export function renderPage(route) {
  const page = pages[`/src/routes${route}/+page.svx`];
  if (!page) throw new Error(`No KB page for ${route}`);
  const rendered = render(page.default);
  return { body: rendered.body, head: rendered.head, metadata: page.metadata };
}
