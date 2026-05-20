// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://geniality.com.co', // ← actualiza con tu dominio real
  adapter: netlify(),
  integrations: [react(), tailwind()]
});
