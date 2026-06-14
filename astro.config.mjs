// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Served from a GitHub Pages project site: https://aha43.github.io/NamProduct/
  // `base` makes Astro prefix bundled asset URLs; absolute internal links use BASE_URL.
  site: 'https://aha43.github.io',
  base: '/NamProduct',
  integrations: [
    tailwind({
      // We keep our own base layer (tokens, dark default) in src/styles/global.css.
      applyBaseStyles: false,
    }),
  ],
});
