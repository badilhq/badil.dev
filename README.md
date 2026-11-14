# badil.dev

The landing page of [badil](https://github.com/badilhq/badil): one static page with an animated diagram of the preview loop.

Vite, React and TypeScript, built to `dist/` and served by a Cloudflare Worker with static assets only.

## Develop

Requires Node 22.12 or later (wrangler 4 needs it).

```sh
npm ci
npm run dev        # the page with hot reload
npm run build      # typecheck, then dist/
npm run preview    # serves dist/ with Vite
```

CI (`.github/workflows/ci.yml`) runs on every pull request and push to `main`: the build (typecheck and Vite build), `wrangler deploy --dry-run`, and the rehearsal gates of the hero and the PR still at 1440, 1024, 820, 390 and 1440 dark against the dev server. A still gate passes when film exits 0 and prints `rehearsal passed`; the loop gate also passes on exit 2 (`inconclusive`) when its only `incomplete:` reasons are sampling gaps. The films and the dev server log are attached to the run as `rehearsal-<variant>` artifacts.

The header's theme control (System, Light, Dark) applies to the page and the illustrations and remembers the visitor's choice in `localStorage` under `badil-theme`; `src/theme.ts` holds it.

## Deploy

```sh
npm run preview:worker   # serves dist/ with wrangler, as Cloudflare will
npm run deploy           # builds, then wrangler deploy
```

`wrangler.jsonc` declares the Worker. The first deploy needs `wrangler login`.

## The illustrations

The hero (`src/stage/FlowDemo.tsx`) and the pull request still (`src/stage/PrStill.tsx`) are built with the [Stageshow](https://benji.org/stageshow) kit, copied into `src/kit`. Their look (colors, square corners, hairline rings, IBM Plex) is set in `src/stage/tokens.css` and `src/stage/flow.css` for the hero and `src/stage/pr-still.css` for the pull request still, with the same values as the page's `src/site.css`.

After changing one, rehearse it against the dev server, not the built page: the checks tell the kit's CSS from the page's by file. Start it on the address the commands use, `npm run dev -- --host 127.0.0.1` (Vite listens on `localhost` only by default).

```sh
node scripts/film.mjs http://127.0.0.1:5173/ --select .hero__stage --reduced --still --gate   # the poster
node scripts/film.mjs http://127.0.0.1:5173/ --select .hero__stage --every 500 --count 34 --gate < /dev/null   # the loop
```

Add `--width 1024`, `820` or `390` for the other designs and `--dark` for the dark theme. Filming uses `playwright-core` and a locally installed Chrome. `src/stage/REHEARSAL.md` records how the hero was built and checked.

## Licenses

The site is MIT licensed; see `LICENSE`. The Stageshow kit (`src/kit`) and its filming scripts (`scripts/`) are MIT licensed; see `src/kit/LICENSE`, `src/kit/NOTICE.md` and `scripts/LICENSE`.
