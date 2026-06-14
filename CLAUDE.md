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

## Open TODOs

Search `TODO` in the source: real download/hosted URLs, product screenshots, `public/og.png`
social card, `site` in `astro.config.mjs`, footer copyright owner.
