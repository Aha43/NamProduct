# Changelog

All notable content, design, and structural changes to the NamProduct site are documented
in this file. Routine copy tweaks and typo fixes are not listed here — see the git history.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Projects detail.** The **Projects** feature card opens a "Projects, nested as deep as you
  like" deep-dive: group related work, then open one into a focused workbench (actions,
  sub-projects, list/heat-map/column views). Reuses the `public/shots/` set.

- **Next up detail.** The **Next up** feature card opens a single-slide deep-dive — the Next
  view pulls every ready action into one list with project, tags, and due dates. Reuses
  `public/shots/next.png`.

- **Tags & views detail.** The **Tags & views** feature card opens a 2-slide deep-dive: filter
  by a tag to pull matching actions across projects, then save the slices you live in (plus
  standing views like Due). New `public/shots/tags.png` + `due.png`; `shots.mjs` captures them.

- **Goal board detail.** The **Goal board** feature card opens a single-slide deep-dive — group
  projects by tag into a Mission Control board, each showing how far along it is. New
  `public/shots/goals.png`; `shots.mjs` creates the board and captures it.

- **Focus mode detail.** The **Focus mode** feature card opens a single-slide deep-dive — the
  immersive, full-screen deck that plays your Next list one action at a time. New
  `public/shots/focus.png`; `shots.mjs` enters Focus from Next and captures it.

- **Detail deep-dives.** Feature cards can now open a "detail" — a panel that hovers over the
  page to explain one aspect of Nam in depth, advanced by hand (no autoplay). The first,
  opened from the **Inbox** card, is **"Ways to process an inbox"**: decide what an item is →
  a quick action → something bigger → nothing to do. Screenshots reuse the `public/shots/`
  set (`scripts/shots.mjs` now also captures the Process… flow). Complements, doesn't replace,
  the inline slideshow.

- **Full-screen detail slides.** A "Full screen" toggle blows a detail's slideshow up to a
  full-bleed lightbox so the screenshot details are legible, with the caption, description, and
  Back/Next controls floating over the image. You can still page through slides; Esc (or the
  toggle, or clicking the image) steps back out before it closes the overlay.

### Changed

- **New tagline.** "Stay clear. Nothing gets lost." → **"Capture loose ends. Find the next
  action."** (hero + CLAUDE.md messaging).

- **Tighter top of page.** Merged the "Built around three ideas" pillars and the "Capture. Sort.
  Do." steps into a single calmer **"Why Nam"** section (dropped the big 01/02/03 numbering), so
  visitors reach the feature mini-tutorials with far less scrolling.

- **"See it in action" is now a full-screen showcase.** Instead of a large inline slideshow, a
  compact "See it in action" trigger opens the screenshots full-screen (legible) with a big X to
  close (also Esc / backdrop). `Screenshots` gained an optional `class` prop to widen in the overlay.

- **Plainer AI section.** Dropped the engineering jargon ("over MCP", "connect … to") — the copy
  now just says you use Claude or ChatGPT alongside Nam and it checks with you before changing
  anything. Closes #18.

- **App CTAs point at the real hosted app.** Buttons now open NamWeb at `usenam.app` instead of
  the GitHub repo: the header "Open app" and hero "Try the demo" go straight to `usenam.app/demo`
  (no account), while "Open Nam in your browser" opens `usenam.app` (sign in / sign up, which also
  links to the demo). Closes #17.

- **Feature-card icons match the web app.** The landing-page feature icons now use the exact
  lucide icons NamWeb shows in its nav (Inbox, Folders, ListTodo, Tag, LayoutDashboard, Target),
  instead of hand-rolled approximations. Closes #16.

- **Tighter landing-page density.** Trimmed the systemic vertical rhythm — section padding,
  the section-header margin, hero padding, and a few oversized grid gaps — so the page reads
  denser without a redesign. Closes #12.

- **Landing copy now matches NamWeb-as-standalone.** Dropped the "no install, no account" /
  "no signup ceremony" claims — NamWeb has real accounts, and the **demo** is the no-account
  on-ramp (now its own hero CTA). The AI section reflects MCP reality: connect Claude *or* ChatGPT,
  with confirmation **connector-side per change** (no implied Nam-native accept/reject). Messaging
  guide in `CLAUDE.md` updated to match. Closes #2.

### Fixed

- **Site no longer renders unstyled on GitHub Pages.** Added `public/.nojekyll` so each build
  emits `.nojekyll` at the published root. Without it, Pages' Jekyll step stripped Astro's
  `_astro/` assets (CSS/JS), 404-ing every stylesheet. Closes #14.

- **Production deploy no longer wipes open PR previews.** The `gh-pages` deploy now commits
  without force-pushing (`force: false`), so the `pr-preview/` dir survives a push to `main`.
  Closes #7.

### Added

- **Social card for shared links.** Added a branded 1200×630 `public/og.png` and fixed the
  `og:image` / `twitter:image` tags to emit an absolute, base-correct URL (they previously pointed
  at a missing, base-less `/og.png`), so links shared to Slack/X/etc. show a proper preview.
  Closes #27.

- **`npm run shots` regenerates the demo screenshots.** A Playwright script (`scripts/shots.mjs`)
  recaptures the four slideshow images from the live demo so they don't drift as the app changes.
  Closes #26.

- **Real demo screenshots in the slideshow.** Captured Inbox, Next, Projects, and an open
  project from the live demo (dark, banner-free, 16:10) and wired them into the slideshow,
  replacing the placeholders. Closes #23.

- **"See it in action" screenshot slideshow.** A new section after the hero auto-advances through
  four captioned slides (Inbox, Next, Projects, an open project) — with dots, prev/next, pause on
  hover/focus, and reduced-motion support. Slides are placeholders for now; real demo screenshots
  land in #23. Closes #22.

- **Development workflow.** CI (`astro check` + build) on every PR, a light changelog, and
  GitHub issue templates — adapted from the NamWeb workflow. PR previews to follow. Closes #3.

- **Per-PR preview deploys.** Every PR is built under its own subpath and published to
  `gh-pages` at `/NamProduct/pr-preview/pr-<n>/`, with the URL auto-commented and torn down on
  close. Production now also deploys via the `gh-pages` branch (preserving the preview dir).
  `astro.config.mjs` reads `base` from `SITE_BASE` so previews resolve under their subpath.
  Closes #5.
