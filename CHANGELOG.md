# Changelog

All notable content, design, and structural changes to the NamProduct site are documented
in this file. Routine copy tweaks and typo fixes are not listed here — see the git history.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Changed

- **Landing copy now matches NamWeb-as-standalone.** Dropped the "no install, no account" /
  "no signup ceremony" claims — NamWeb has real accounts, and the **demo** is the no-account
  on-ramp (now its own hero CTA). The AI section reflects MCP reality: connect Claude *or* ChatGPT,
  with confirmation **connector-side per change** (no implied Nam-native accept/reject). Messaging
  guide in `CLAUDE.md` updated to match. Closes #2.

### Fixed

- **Production deploy no longer wipes open PR previews.** The `gh-pages` deploy now commits
  without force-pushing (`force: false`), so the `pr-preview/` dir survives a push to `main`.
  Closes #7.

### Added

- **Development workflow.** CI (`astro check` + build) on every PR, a light changelog, and
  GitHub issue templates — adapted from the NamWeb workflow. PR previews to follow. Closes #3.

- **Per-PR preview deploys.** Every PR is built under its own subpath and published to
  `gh-pages` at `/NamProduct/pr-preview/pr-<n>/`, with the URL auto-commented and torn down on
  close. Production now also deploys via the `gh-pages` branch (preserving the preview dir).
  `astro.config.mjs` reads `base` from `SITE_BASE` so previews resolve under their subpath.
  Closes #5.
