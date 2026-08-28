# «Анонсы»: branding SoT for OV-04 / OV-05

Status: `PENPOT_MATERIALIZED / READY_FOR_OWNER_REREVIEW`

This contract records the existing Astro brand system without inventing a new
logo family. It is the Git-side input for the owner-readable Penpot page
`10.1 Announcements Wordmark` after Penpot is resumed.

## Canonical ownership

- `AnnouncementsWordmark.astro` is the one live wordmark component. It renders
  the current-colour SVG symbol from `announcements-wordmark-ui.svg`.
- `AnnouncementsLockup.astro` is the one lockup component. Its only structural
  variants are `desktop` and `mobile`.
- The endorsement remains live DOM text. Desktop uses one line; mobile uses
  `Полюбить` / `Калининград` on two lines.
- Desktop and mobile leather files are decorative static skins behind the live
  lockup. They are not alternate logo roots and must never contain baked text.
- PWA launcher images and the favicon are static application assets, not Penpot
  component masters.

Exact dimensions, hashes, spacing and the component/static-asset classification
are source-locked in
[`contract.v1.json`](../../catalog/branding/announcements-v1/contract.v1.json).

## Accepted runtime specimens

| Context | Tag | Lockup | Endorsement | Wordmark |
|---|---:|---:|---:|---:|
| desktop header, `≥1024px` | `240×88`, padding `18 24 16 24`, bottom radius `12` | width `192`, rows `12px / auto`, gap `4` | `11/12px`, weight `600`, `.08em`, uppercase, one line | `192px` wide |
| mobile header | `120×84`, padding `0 0 12 14`, bottom radius `14` | column, start/end aligned, gap `4` | `7.5/8px`, runtime weight `750`, `.075em`, uppercase, two lines | `96px` wide |

The fallback surface is `#98401f`. Desktop uses the `30:11` leather skin;
mobile uses the `10:7` skin supplied at `3×` density. Lettering stays live and
sharp over both.

## PWA artwork

The Astro source note identifies `docs/reference/PKA-PWA2.png` as the
operator-approved source. The manifest publishes deterministic `192` and `512`
`purpose:any` images plus matching `purpose:maskable` images. Maskable artwork
uses the documented `82%` safe-area treatment; the launcher label remains
`Анонсы`.

The requested Penpot “PWA cover” specimen should therefore display the
canonical `512×512` any-purpose artwork beside the `512×512` maskable safe-area
artwork. It must be labelled as static launcher artwork, not rebuilt as a UI
component or substituted by an approximate card.

## Penpot projection

Page `10.1 — Announcements wordmark · Native component`
(`d87e18f1-dcb4-80a6-8008-878517c731e9`) now contains the owner-readable
branding board, the preserved canonical wordmark master, native desktop/mobile
lockup masters and linked specimens. Desktop/mobile leather stays a static
image fill behind linked lockup content. The PWA specimens are explicitly
classified as static application artwork.

The canonical `512×512` PWA PNG payload exceeded the MCP JSON request-body
limit (`HTTP 413`), so Penpot uses source-derived `256×256` WebP display proxies.
This is a display-only transport exception: canonical paths and SHA-256 values
remain in the Git contract. Exact component ancestry and image identity were
read back, file validation returned `[]`, and a focused `1440×1980` export was
visually inspected. Saved version:
`Recovery 2026-08-28 · OV-04/05 branding accepted projection · Astro c33652ed0`.

The batch is `READY_FOR_OWNER_REREVIEW`, not processed: owner acceptance is
still required.
