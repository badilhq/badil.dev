# Rehearsal: badil hero

## FlowDemo

Brief (round 2): badil builds one preview across apps and across commits. Two pull requests in two repos (`acme/backend` #42, `acme/front` #17, both on `feature/pricing`) land in the same preview `feature-pricing`, each pinning its own service; Argo CD deploys it; on merge it is gone. Round 1 (one PR, four services) is replaced in place.

Gold: `annotations` (filmed `collect`, `flow`, `branch`, `stream`; also `story`, `subscriptions`, `payout-flow`). Kept from it: nodes placed per layout and measured with `rect()`, every route derived from the measured edges (6px short of the node), a fixed thin neutral route under a moving phase (`stream`), short plain labels beside the line (`stream`'s rate label), white nodes with a hairline ring (`--ss-shadow-ground`). Changed: the phase is one dot per beat (accent in flight, neutral where it lands, so the poster still shows each line's last direction); no plate; badil's neutral grays (light) and green-tinted near-blacks (dark) with terminal green as the single accent (green also means live: synced, healthy, success); badil's card (bars resolve to words in place, pinned shas in amber) is the hero with `--ss-shadow-hero`, the nodes take `--ss-shadow-ground`.

Composition: one hero (badil: `badil`, `Preview feature-pricing`, three rows `backend` / `front` / `postgres` with a status dot each, `ready in 3m 28s`), four small nodes symmetric around it (the two pull requests left; gitops repo over Argo CD right), five lines, nothing else.

Lines (none cross, none pass under a node): each pull request → badil `label` (`merged` on merge), badil → gitops repo `writes the preview` (`writes` on the tablet; `deletes` on merge), gitops repo → Argo CD `syncs`, Argo CD → badil `healthy`. Labels hold the footprint of their longer word (`States`), the label of the line in flight turns accent. The dot is CSS `offset-path` on the measured route, keyed per trip; the previous trip's dot fades where it rested.

Beats (loop 15.6s, measured between `rest` marks 0.06s → 15.68s):
1. label 0.36s: `preview` on `acme/backend`, dot into badil; compose 1.5s (brisk): `feature-pricing`, `backend` pinned `a1b2c3d4`, `front` and `postgres` on `main`; write 2.9s: dot `writes the preview`, the file appears in the repo.
2. second 4.0s: `preview` on `acme/front`, dot into badil; pin 5.2s: the `front` row lights (amber fill, `--bd-pin-soft`) and its ref crossfades in place from `main` to pinned `9f8e7d6c`, held 1.2s; dot `writes the preview` again, the existing file line lights briefly (an update, not a new file).
3. deploy 7.9s: dot `syncs`, Argo CD `Syncing` then `Synced · Healthy`; dot `healthy` into badil; rows green (70ms stagger), `ready in 3m 28s`, both pull requests `Deployment · Success` 90ms apart. Poster from `ready` 10.9s, held 1.6s (shortened from 2s to keep the second pull request whole).
4. merge 12.5s: both `Merged`, dots `merged` on both PR lines, dot `deletes`; the path is struck, then leaves with Argo CD's line and `ready`; rows clear bottom-up; chips, PR lines and resting dots fade. Rest at 15.7s; no fade reset.

Designs (switched by media query, keyed; all 1:1):
- wide 1100×352 (≥1148px): PRs stacked left (244 wide), badil centre (296), repo over Argo CD right; the PR line heights match the repo and Argo CD lines, so the lane is symmetric. The PR nodes carry `acme/<repo> #NN`, then `feature/pricing` and the `preview` chip, then the status line.
- mid 768×352 (600–1147px: 1024 and 820): badil in the middle fits now. Nodes 176, badil 248, lines 56px; shorter word `writes` on the write line; the branch is left out (repo name and label first; `#NN` moves beside the chip); the path wraps after a slash.
- phone 358×692 (<600px): the two PRs side by side (163 each, status at 11px), then badil, repo, Argo CD with vertical lines; `healthy` returns up a lane on the right. Gutter 12 on this design.

Look (ops-native identity, set in `tokens.css` and `flow.css`; the PR still in `pr-still.css`, same values): green accent (`#0a7a3a` light, `#3ddc84` dark) for the accent, success and healthy alike; pinned SHAs, their pin icons and the pin flash of a row in amber (`--bd-pin` `#8a5300` / `#f2b23e`, `--bd-pin-soft`); square shapes (the kit's `--ss-radius-*` overridden to `0` at the stage root, every literal radius `0`), except what is round (status dots, travelling dots, avatars, the PR state disc) and the skeleton bars, whose radius is inline from TSX; 1px rings instead of soft shadows (`--ss-shadow-hero: 0 0 0 1px var(--ss-text-strong)` on the hero, `var(--ss-line)` on the nodes and the PR still); text in IBM Plex Sans Variable (narrower than `system-ui` for every string that constrains a node), SHAs, branch, code and paths in IBM Plex Mono. In the PR still the SHAs stay neutral code chips: the markup does not tell a SHA from `main`.

Gate, ops-native identity (2026-11-13, dev server, film.mjs `--gate`): hero loop and poster and PR still poster (`--select .pr__still --reduced --still --gate`) at 1440, 1024, 820, 390 and 1440 `--dark`: every run prints `rehearsal passed`, no candidate lines. The loops still end `film: inconclusive` (largest sampling gap 28.0-39.6ms over 27ms), as before. The PR still first failed at the four wide runs with `uneven padding: div.ps-card has top 12px against 17px at the side`: with Plex Sans the bot name starts 11.5px below the card top (12.5px with `system-ui`), under 0.7 × 17. The comment card header went from 40px to 42px in the wide layout (40px kept in the compact one), which clears it.

Fonts on `/` (fresh context, `npm run build` + `npm run preview`): four latin woff2 files, 90928 B in all: `ibm-plex-mono-latin-400-normal` 14708 B, `-500-normal` 14888 B, `-600-normal` 15620 B, `ibm-plex-sans-latin-wght-normal` 45712 B. The only non-ASCII characters on the page are `·` (latin subset) and `→` (no Plex subset; falls back without a download).

Gate before the ops-native identity (film.mjs `--gate` on the real page `/`, `--select .hero__stage`; loop every 500ms × 34, poster `--reduced --still`):
- 1440 loop: `rehearsal passed` · poster: `rehearsal passed`
- 1024 loop: `rehearsal passed` · poster: `rehearsal passed`
- 820 loop: `rehearsal passed` · poster: `rehearsal passed`
- 390 loop: `rehearsal passed` · poster: `rehearsal passed`
- 1440 dark loop: `rehearsal passed` · poster: `rehearsal passed`
No candidate lines printed (film still says `inconclusive` for sampling gaps over 27ms). Two loop runs (1440, 820) stalled at 0% CPU when film inherited the shell's stdin under a 150s timeout; rerun with stdin from /dev/null they passed in about 45s.

Fixed during rehearsal (round 2): PR status running into the node's right padding on the phone (nodes 163, gutter 12, status 11px); loop 16.4s → 15.6s (holds shortened, the second pull request kept whole).

Round 1 fixes still in: `tight inset` on the title, `tight mark` on row dots, hub padding, `vanishes with no exit` on node marks, `settle snap` on status lines (States instead of Roll), `jump` on a weight change, the loop-seam warning (trip counters snapped back once their dots have faded), dark: badil's card lighter than the nodes.

Real strings at the poster (wide): `badil`, `Preview`, `feature-pricing`, `backend`, `a1b2c3d4`, `front`, `9f8e7d6c`, `postgres`, `main`, `ready in 3m 28s`, `acme/backend`, `#42`, `acme/front`, `#17`, `feature/pricing` (×2), `preview` (×2), `Deployment · Success` (×2), `Gitops repo`, `previews/feature-pricing/values.yaml`, `Argo CD`, `Synced · Healthy`, `label` (×2), `writes the preview`, `syncs`, `healthy`: 25 distinct (29 on screen counting the repeats).

Not checked: real iPad and phone, Safari and Firefox (`offset-path: path()` carries the dots), dark in motion below 1440, reduced motion toggled mid-loop, a resize across a breakpoint mid-loop, a separate fresh-eye review.
