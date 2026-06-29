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
`gh api repos/Aha43/NamProduct/pages -q .source`. So **publishing means pushing the built
`dist/` to `gh-pages`.** Two workflows automate that (they share a `gh-pages-write`
concurrency group so they never clobber each other on the branch):

- **`deploy.yml`** — on push to `main`, builds and publishes to the `gh-pages` root via
  `JamesIves/github-pages-deploy-action` (commit "Deploying to gh-pages … 🚀"). `clean:true`
  with `clean-exclude: pr-preview, prerelease, shots` so it refreshes the site without
  wiping the sibling preview/screenshot dirs.
- **`pr-preview.yml`** — on every PR, `rossjrw/pr-preview-action` deploys to `gh-pages`
  `pr-preview/pr-<N>/` (live at `…/NamProduct/pr-preview/pr-<N>/`) and removes it on close
  ("Deploy preview … 🛫" / "Remove preview … 🛬"). It builds with
  `--base /NamProduct/pr-preview/pr-<N>` so assets + BASE_URL links resolve under the subpath.
- **`npm run shots`** regenerates demo screenshots (`scripts/capture-details.mjs`); needs
  the NamWeb dev server running (`cd ../NamWeb && npm run dev`).

History note: this automation was previously dropped in a repo history rewrite (and was
never in CLAUDE.md/memory, so it didn't survive) — re-added 2026-06-29. Orphan artifacts of
the old runs sit on `gh-pages`: `pr-preview/pr-13…29/`, `shots/*.png`.

- **Manual one-off preview** (no PR; e.g. the `/prerelease/` build): build with a subpath
  base and add only that folder to `gh-pages` via a `git worktree` off `origin/gh-pages`
  (keep a `.nojekyll`); confirm `git diff --cached --name-status origin/gh-pages` shows only
  `<name>/`. Prefer opening a PR and letting `pr-preview.yml` do it.

## Open TODOs

Search `TODO` in the source: real download/hosted URLs, product screenshots, `public/og.png`
social card, `site` in `astro.config.mjs`, footer copyright owner.
