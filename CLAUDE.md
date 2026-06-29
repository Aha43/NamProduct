# CLAUDE.md — NamProduct

Marketing website for the **Nam** suite (NAM = *Next Action Master*), a local-first,
GTD-inspired productivity system. This repo is the public-facing site; the actual apps live
in sibling repos `../NamDesktop` (Java/Swing, primary) and `../NamWeb` (React, companion).

## Stack & commands

- **Astro + Tailwind CSS**, static output. Node 18+.
- `npm run dev` / `npm run build` / `npm run preview` / `npm run check` (`astro check`).
- `npm run shots` regenerates the slideshow screenshots in `public/shots/` from the live demo
  (`scripts/shots.mjs`, Playwright — run `npx playwright install chromium` once). Re-run when the
  app's UI changes so the shots don't drift.

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
- Positioning: use it anywhere · stay focused · work with AI.
- **NamWeb is the default, standalone product** — runs in any browser, with **real accounts**
  (sign up / verify / export), single-player by design. The **demo** is the no-account on-ramp;
  don't claim the whole product is accountless ("no account" applies to the demo, not NamWeb).
- **NamDesktop is the power / local-first niche** (own your data, a single file or Git sync, no
  cloud) — not the default.
- **AI:** you connect **Claude or ChatGPT to Nam over a remote MCP server** — Nam doesn't embed an
  assistant. Writes are **confirmed connector-side, per change** (the assistant prompts before each
  tool runs), so don't imply a Nam-native "accept/reject" dialog.

## Workflow

Adapted from NamWeb's, scaled down for a static marketing site.

- **Work on a GitHub issue** for anything substantive (content, messaging, structure, design);
  trivial typo fixes can skip one. Include `Closes #<n>` in non-chore commits.
- **`main` is branch-protected.** No direct pushes — every change lands via a PR with the
  **`check`** CI job (`astro check` + `astro build`) green. Squash-merge, linear history. Solo
  self-merge is fine once `check` passes.
- **Check the branch before committing.** If on `main`, warn and stop. Feature work goes on a
  branch (default `feature/next`, renamed descriptively before the PR).
- **One PR per content sprint, not per item.** This is a *content* project, so a whole sprint
  (e.g. "details for Projects, Next, Tags, Goals, Focus") lands as **one branch → one PR** — its
  items are slices of the same few files (`src/pages/index.astro`, `scripts/shots.mjs`,
  `CHANGELOG.md`), so splitting them into parallel per-item PRs just makes them collide on the same
  lines and turns merging into a conflict slog. (The *app* repos — NamWeb, NamDesktop — are the
  opposite: there a PR is an independent unit of functionality, so one-PR-per-item is right. That
  model does not carry over here.) Work one sprint at a time, stop and confirm before the next, and
  only split into multiple PRs if explicitly asked.
- **Update `CHANGELOG.md`** (`## [Unreleased]`) only for substantive content/design/structure
  changes — not routine copy tweaks. `Added` / `Changed` / `Fixed`, with `Closes #<n>`.
- **PR previews:** every PR is published to `gh-pages` at `/NamProduct/pr-preview/pr-<n>/`
  (`pr-preview.yml`), with the URL auto-commented and removed on close. Previews are built with
  `SITE_BASE` overriding the Astro `base` so assets resolve under the subpath. Production also
  deploys via the `gh-pages` branch (`deploy.yml`), preserving the `pr-preview/` dir. The Pages
  source is **Deploy from branch → gh-pages / root**.

## Open TODOs

Search `TODO` in the source: real download/hosted URLs, product screenshots, `public/og.png`
social card, `site` in `astro.config.mjs`, footer copyright owner.
