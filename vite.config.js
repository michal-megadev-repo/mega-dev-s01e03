import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const local = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [svelte({
    configFile: false,
    inspector: false,
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layoutPropForwarding: 'runes',
      layout: { runbook: local('./src/lib/layouts/runbook.svelte') }
    }),
    compilerOptions: { css: 'injected' }
  })],
  resolve: { alias: { '#lib': local('./src/lib') } },
  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: { input: local('./tooling/entry-client.js') }
  }
});
