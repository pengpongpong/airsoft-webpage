// @ts-check
import { loadEnv } from 'vite';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// .env is not loaded in config files; use loadEnv per Astro docs
// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
let env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// Fallback: loadEnv expects UTF-8. If .env is UTF-16 (common on Windows), parse manually.
if (!env.PUBLIC_SANITY_PROJECT_ID) {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    let raw = '';
    try {
      raw = readFileSync(envPath, 'utf8');
      // UTF-16 BOM or null bytes between chars = wrong encoding
      if (raw.charCodeAt(0) === 0xfeff || raw.includes('\u0000')) {
        raw = readFileSync(envPath, 'utf16le');
      }
    } catch {
      try {
        raw = readFileSync(envPath, 'utf16le');
      } catch {}
    }
    if (raw) {
      for (const line of raw.split(/[\r\n]+/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
        if (m) env = { ...env, [m[1]]: m[2].replace(/^["']|["']$/g, '').trim() };
      }
    }
  }
}

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id';
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production';

if (projectId === 'your-project-id') {
  console.warn(
    '\n⚠️  Sanity project ID not configured.\n' +
      `    cwd: ${process.cwd()}\n` +
      '    Add PUBLIC_SANITY_PROJECT_ID=your-id to .env in the project root\n' +
      '    https://sanity.io/manage\n'
  );
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: { enabled: true },
  }),
  vite: {
    // @ts-expect-error - Vite plugin type mismatch between project and Astro's bundled Vite
    plugins: [basicSsl()],
    define: {
      'import.meta.env.PUBLIC_SANITY_PROJECT_ID': JSON.stringify(projectId),
      'import.meta.env.PUBLIC_SANITY_DATASET': JSON.stringify(dataset),
    },
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      studioBasePath: '/admin',
    }),
    react(),
  ],
});
