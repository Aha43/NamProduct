# CLAUDE.md — NamProduct

Marketing website for the **Nam** suite (NAM = *Next Action Master*), a local-first,
GTD-inspired productivity system. This repo is the public-facing site; the actual apps live
in sibling repos `../NamDesktop` (Java/Swing, primary) and `../NamWeb` (React, companion).

## Stack & commands

- **Astro + Tailwind CSS**, static output. Node 18+.
- `npm run dev` / `npm run build` / `npm run preview`.

## Conventions

- **Design tokens mirror NamWeb** (`../NamWeb/src/index.css`). Token definitions live in
  `src/styles/global.css` as HSL CSS variables and are wired into Tailwind in
  `tailwind.config.mjs`. The site defaults to **dark** (`<html class="dark">`).
- **Brand green is `#3FA463`** — fixed across themes (the `brand` Tailwind color). It is the
  "signal / completion" accent; primary blue comes from the `--primary` token.
- The brand mark (`src/components/LogoMark.astro`) is ported from
  `../NamWeb/src/components/brand/LogoMark.tsx` — keep them visually in sync. Structural
  parts use `currentColor`; the green arc + white check are fixed.
- Single landing page (`src/pages/index.astro`); add per-product pages under `src/pages/`
  only if scope grows.

## Messaging (keep consistent with the apps)

- Tagline: **"Stay clear. Nothing gets lost."**
- Positioning: own your data · stay focused · work with AI. Local-first, no account/
  subscription. NamDesktop = workbench (primary); NamWeb = synced companion.

## Deploy & previews

GitHub Pages here is **`build_type: legacy` — it serves the `gh-pages` branch root** at
`https://aha43.github.io/NamProduct/` (not the Actions artifact pipeline). Verify with
`gh api repos/Aha43/NamProduct/pages -q .source`.

- **Publishing = pushing built `dist/` to `gh-pages`.** The checked-in
  `.github/workflows/deploy.yml` uses `withastro/action` + `actions/deploy-pages`, the
  *artifact* method — which only publishes when the Pages source is "GitHub Actions". It is
  **mismatched with the legacy/branch serving, so merges to `main` do NOT update the live
  site.** (As of 2026-06, the live site is frozen at an old `JamesIves` deploy.)
- **There was a tighter automated workflow that a history rewrite dropped:**
  `JamesIves/github-pages-deploy-action` (main → `gh-pages` root, commit "Deploying to
  gh-pages … 🚀") + `rossjrw/pr-preview-action` (each PR → `gh-pages` `pr-preview/pr-<N>/`,
  "Deploy preview … 🛫" / "Remove preview … 🛬"), plus an `npm run shots` script for demo
  screenshots. Orphans of it remain on `gh-pages`: `pr-preview/pr-13…29/`, `shots/*.png`.
- **Branch/sprint preview (manual, current method):** build with a subpath base and add
  only that folder to `gh-pages`, leaving the live site untouched —
  `npx astro build --base /NamProduct/<name>`, then via a `git worktree` off
  `origin/gh-pages` replace only `<name>/` (keep a `.nojekyll`), commit, push. Confirm
  `git diff --cached --name-status origin/gh-pages` shows only `<name>/`. Live preview at
  `…/NamProduct/<name>/`. Done this way for `/prerelease/`.

## Open TODOs

Search `TODO` in the source: real download/hosted URLs, product screenshots, `public/og.png`
social card, `site` in `astro.config.mjs`, footer copyright owner.
