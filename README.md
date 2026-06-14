# NamProduct

Marketing / product website for the **Nam** suite — *Next Action Master*, a local-first,
GTD-inspired productivity system.

It tells the story of the two apps:

- **[NamDesktop](https://github.com/Aha43/NamDesktop)** — the primary, local-first app.
- **[NamWeb](https://github.com/Aha43/NamWeb)** — the lightweight, synced web companion.

## Stack

- [Astro](https://astro.build/) — static site generator (ships mostly plain HTML/CSS).
- [Tailwind CSS](https://tailwindcss.com/) — styling. Design tokens are ported from NamWeb so
  the site matches the apps.

## Develop

```sh
npm install      # once
npm run dev      # local dev server (http://localhost:4321)
npm run build    # static production build → dist/
npm run preview  # serve the production build locally
```

## Structure

- `src/pages/index.astro` — the single landing page (all sections).
- `src/layouts/BaseLayout.astro` — `<head>`, SEO/Open Graph meta, dark default.
- `src/components/` — `LogoMark`, `Wordmark`, `Section`, `FeatureCard`.
- `src/styles/global.css` — Tailwind layers + design tokens (HSL variables).
- `public/favicon.svg` — brand mark favicon.

## Deploy

The build output in `dist/` is fully static — host it free on Netlify, Cloudflare Pages,
GitHub Pages, or any static host. Set `site` in `astro.config.mjs` to the production URL to
enable canonical + Open Graph URLs.

## TODOs before launch

- Real download / hosted URLs (search for `TODO` in `src/pages/index.astro`).
- Product screenshots (desktop Next Actions panel + NamWeb phone shell).
- A 1200×630 social card at `public/og.png`.
- Confirm the footer owner/copyright name.
