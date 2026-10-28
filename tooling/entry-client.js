import { hydrate } from 'svelte';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const route = location.pathname.replace(/\/$/, '') || '/kb';
const page = pages[`/src/routes${route}/+page.svx`];
if (page) hydrate(page.default, { target: document.getElementById('app') });
