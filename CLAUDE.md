# CLAUDE.md — NamProduct

Marketing website for the **Nam** suite (NAM = *Next Action Master*), a local-first,
GTD-inspired productivity system. This repo is the public-facing site; the actual apps live
in sibling repos `../NamDesktop` (Java/Swing, primary) and `../NamWeb` (React, companion).

## Stack & commands

- **Astro + Tailwind CSS**, static output. Node 18+.
- `npm run dev` / `npm run build` / `npm run preview` / `npm run check` (`astro check`).

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

## Workflow

Adapted from NamWeb's, scaled down for a static marketing site.

- **Work on a GitHub issue** for anything substantive (content, messaging, structure, design);
  trivial typo fixes can skip one. Include `Closes #<n>` in non-chore commits.
- **`main` is branch-protected.** No direct pushes — every change lands via a PR with the
  **`check`** CI job (`astro check` + `astro build`) green. Squash-merge, linear history. Solo
  self-merge is fine once `check` passes.
- **Check the branch before committing.** If on `main`, warn and stop. Feature work goes on a
  branch (default `feature/next`, renamed descriptively before the PR).
- **One issue at a time** — stop and confirm before the next. **Auto-sprint mode** runs an agreed
  batch straight through: one issue → one independent branch → one PR, no merging mid-sprint.
- **Update `CHANGELOG.md`** (`## [Unreleased]`) only for substantive content/design/structure
  changes — not routine copy tweaks. `Added` / `Changed` / `Fixed`, with `Closes #<n>`.
- **PR previews:** not wired up yet (planned — GitHub Actions deploy of each branch to a
  `gh-pages` subfolder, with a per-PR `base` override). Until then, reviewers build locally
  (`make preview`) or rely on the CI build + screenshots.

## Open TODOs

Search `TODO` in the source: real download/hosted URLs, product screenshots, `public/og.png`
social card, `site` in `astro.config.mjs`, footer copyright owner.
