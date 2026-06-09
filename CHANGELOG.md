# Changelog

All notable changes to this project will be documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com), and this project
adheres to [Semantic Versioning](https://semver.org) — see
[VERSIONING.md](VERSIONING.md) for the local policy.

## [Unreleased]

—

## [v0.19.0] — 2026-06-09

First release under the new SemVer-by-content tagging policy. All 38
historical tags have been remapped from the legacy `-hf*` / `-pre*`
suffix soup onto stable `vX.Y.Z` names (see the
[remap script](scripts/remap-tags.sh) for the full mapping table). No SHA
was rewritten — only the labels.

This entry covers the work delivered between the last historical stable
tag (legacy `0.2.5-pre14` → `v0.11.2`) and HEAD (legacy `0.2.7-pre8` →
`v0.19.0`). The intermediate stable tags `v0.12.0..v0.18.0` exist at the
right SHAs but did not get their own changelog entry — the checkpoint
positions are preserved, the narrative below is the cumulative picture.

### Added

- **shadcn-vue scaffolding** — `cn` helper, `alert`, `sonner` primitives.
  PrimeVue is fully removed: `Toast` → `vue-sonner`, `Spinner` / `Message`
  on the authorize page → shadcn equivalents, the PrimeVue preset and
  auto-import resolver dropped from the Vite config.
- **Live password strength meter** on the register and password-reset
  pages, driven by a lazy-loaded `zxcvbn` and a `usePasswordPolicy`
  composable that fetches the server-side policy once at boot.
- **Federation completion flows** — `/linked-accounts` result page,
  `/complete-account` staged signup onboarding, `/link-account` page.
  Social login redirects wired end-to-end.
- **OAuth signup context** — `/register` honours `prompt=create` and
  resolves invitations server-side (the redundant email field is gone).
- **`email_not_verified` inline resend** on the login page — surfaces the
  backend error with an inline action instead of a generic 401 string.
- **Remember-me checkbox** on login.
- **Dynamic registration form fields** — schema rendered from the server,
  no more hard-coded inputs in the SFC.
- **Logout auto-redirect** — when `redirect_uri` is set the page bounces
  back to the RP after 1.2s instead of staying parked.
- **Verify-email error-only fallback page** with inline resend action.
- **`VERSIONING.md`** + this changelog.
- **CI tag-format gate** — `.forgejo/workflows/tag-format.yml` rejects
  pushes of tags not matching `^v[0-9]+\.[0-9]+\.[0-9]+(-rc\.[0-9]+)?$`.

### Fixed

- Federation onboarding rendered the bullet placeholders and accents as
  literal characters instead of styled output — corrected.

### Removed

- 38 legacy tags (`0.1.0-hf*`, `0.2.0`, `0.2.1`, `0.2.1-hf*`, `0.2.2`,
  `0.2.4-pre*`, `0.2.5-pre*`, `0.2.6-pre*`, `0.2.7-pre*`). Each remapped
  to a stable `vX.Y.Z` by content type. See `scripts/remap-tags.sh` for
  the mapping; the snapshot at `/tmp/orion-auth-authui-tags-before.txt`
  was taken before the remap.
- PrimeVue, the PrimeVue preset, the unplugin-vue-components PrimeVue
  resolver — replaced by shadcn-vue + vue-sonner.

## Legacy history (pre-remap)

The 38 historical tags were renamed to stable `vX.Y.Z` releases based on
the commit-content classification described in `VERSIONING.md`. Each new
tag points at the same SHA as the old one — no commit was lost or
rewritten. A high-level summary of the lines:

- **`v0.1.x` — v0.1.0..v0.1.2** — initial release + nginx SPA query
  preservation + relative API path fix.
- **`v0.2.x` — v0.2.0..v0.2.4** — register-link visibility toggle +
  consent dedup + password input UX fixes.
- **`v0.3.0`** — device code flow UI.
- **`v0.4.x` — v0.4.0..v0.4.3** — API Resource permissions on consent +
  CSS / hero cleanup.
- **`v0.5.0..v0.7.0`** — OIDC Core parameter support, logout page,
  `response_mode`, phone/address scope copy, `session_state`
  propagation.
- **`v0.8.0..v0.9.x`** — restyle pass (mockup match) + v2 console-card
  design + real-logo and email+password layout fixes.
- **`v0.10.0..v0.10.1`** — auto/dark/light theme toggle + PAR
  `request_uri` acceptance.
- **`v0.11.x` — v0.11.0..v0.11.2`** — discord federation (google /
  microsoft / apple dropped) + success-orb centering + surfacing server
  error messages instead of generic 401/403 strings.
- **`v0.12.0..v0.13.x`** — social login redirect + link-account page +
  `/complete-account` staged signup + bullet-placeholder fix.
- **`v0.14.0..v0.15.x`** — server-driven registration form schema +
  logout auto-redirect + PrimeVue removal.
- **`v0.16.0..v0.18.0`** — live password strength meter + `/linked-accounts`
  result page + remember-me checkbox.

[Unreleased]: https://git.nhsoul.fr/nhpro/orion-auth-authui/compare/v0.19.0...HEAD
[v0.19.0]: https://git.nhsoul.fr/nhpro/orion-auth-authui/releases/tag/v0.19.0
