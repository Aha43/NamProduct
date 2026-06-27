// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Served from a GitHub Pages project site: https://aha43.github.io/NamProduct/
// `base` makes Astro prefix bundled asset URLs; absolute internal links use BASE_URL.
// PR previews live at /NamProduct/pr-preview/pr-<n>/, so CI overrides the base via
// SITE_BASE to keep asset URLs resolving under the preview subpath.
const base = process.env.SITE_BASE ?? '/NamProduct';

// https://astro.build/config
export default defineConfig({
  site: 'https://aha43.github.io',
  base,
  integrations: [
    tailwind({
      // We keep our own base layer (tokens, dark default) in src/styles/global.css.
      applyBaseStyles: false,
    }),
  ],
});
