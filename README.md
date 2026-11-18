# badil.dev

The site of [badil](https://github.com/badilhq/badil): the landing page, with an animated diagram of the preview loop, and the docs at `/docs`.

The landing is Vite, React and TypeScript, built to `dist/`. The docs are a Next.js and Fumadocs static export in `docs/`, copied to `dist/docs/`. A Cloudflare Worker with static assets only serves `dist/`.

## Develop

Requires Node 22.12 or later (wrangler 4 needs it).

```sh
npm ci
npm run dev        # the page with hot reload
npm run build      # typecheck, the landing, then the docs: dist/ and dist/docs/
npm run preview    # serves dist/ with Vite
```

CI (`.github/workflows/ci.yml`) runs on every pull request and push to `main` only: the build (typecheck, Vite build, and the docs built at the tag in `docs/badil-version`), the docs unit test, `wrangler deploy --dry-run`, and the rehearsal gates of the hero and the PR still at 1440, 1024, 820, 390 and 1440 dark against the dev server. A still gate passes when film exits 0 and prints `rehearsal passed`; the loop gate also passes on exit 2 (`inconclusive`) when its only `incomplete:` reasons are sampling gaps. The films and the dev server log are attached to the run as `rehearsal-<variant>` artifacts. A push to `main` deploys only after the build and every rehearsal gate pass: it deploys to `badil.dev` through the `production` environment; `www.badil.dev` redirects to it.

The header's theme control (System, Light, Dark) applies to the page and the illustrations and remembers the visitor's choice in `localStorage` under `badil-theme`; `src/theme.ts` holds it.

## Deploy

```sh
npm run preview:worker   # serves dist/ with wrangler, as Cloudflare will
npm run deploy           # builds, then wrangler deploy
```

`wrangler.jsonc` declares the Worker. CI deploys from `main` with the `production` environment's `CLOUDFLARE_API_TOKEN` (built from the "Edit Cloudflare Workers" template, Account Resources limited to the badil.dev account, Zone Resources limited to the badil.dev zone) and `CLOUDFLARE_ACCOUNT_ID`. A local `npm run deploy` needs the same two variables, or `wrangler login` on that account.

Production builds, including local previews of `dist/` (`npm run preview`, `npm run preview:worker`), load Cloudflare Web Analytics (cookie-less, no personal data): the landing through a `vite.config.ts` plugin, the docs through `docs/app/layout.tsx`. The dev servers do not.

To roll back, revert the commit on `main`; CI redeploys the previous version.

## The docs

`docs/` is its own npm project (Next.js, Fumadocs, static search), exported with `basePath: '/docs'` and served at `badil.dev/docs`. Its content is not in this repo: it is badil's `docs/*.md`, read at the badil release pinned in `docs/badil-version` (one line, the tag, such as `v0.23.0`).

The root `npm run build` runs `npm run build` in `docs/`. Its content step (`docs/scripts/content.mjs`) fetches badil's `docs/*.md` at that tag, writes them to `docs/content/docs/` (generated, gitignored) and rewrites their links: links between docs become site paths, links to other files of the repo become GitHub URLs pinned to the tag. A malformed or unknown tag, or a relative link to a path missing at that tag, fails the build. `dist/docs/version.json` records the tag the docs were built at.

- `GITHUB_TOKEN`, when set, authenticates the content step's GitHub API call (CI passes the workflow token; without it, the unauthenticated rate limit applies).
- `BADIL_REF=<tag> npm run build` builds the docs at another tag, to try a release before pinning it; CI never sets it.
- `mermaid` code blocks in badil's docs render as diagrams: inline SVG drawn at build time by `beautiful-mermaid` (`docs/components/mdx/mermaid.tsx`), no client-side Mermaid.
- `npm test --prefix docs` runs the unit tests of the link rewriting and of the Mermaid rendering.
- `npm run dev --prefix docs` runs the content step, then the docs alone with hot reload (served at `http://localhost:3000/docs`).

Nothing updates the docs automatically: a badil release reaches the site only when someone bumps the pinned tag. To document a new release:

1. Edit `docs/badil-version` to the new badil release tag.
2. Open a pull request: CI builds the docs at that tag, runs the unit test and the rehearsal.
3. Merge it: the push to `main` deploys.

## The illustrations

The hero (`src/stage/FlowDemo.tsx`) and the pull request still (`src/stage/PrStill.tsx`) are built with the [Stageshow](https://benji.org/stageshow) kit, copied into `src/kit`. Their look (colors, rounded corners, hairline rings, Schibsted Grotesk and the system mono) is set in `src/stage/tokens.css` and `src/stage/flow.css` for the hero and `src/stage/pr-still.css` for the pull request still, with the same values as the page's `src/site.css`.

After changing one, rehearse it against the dev server, not the built page: the checks tell the kit's CSS from the page's by file. Start it on the address the commands use, `npm run dev -- --host 127.0.0.1` (Vite listens on `localhost` only by default).

```sh
node scripts/film.mjs http://127.0.0.1:5173/ --select .hero__stage --reduced --still --gate   # the poster
node scripts/film.mjs http://127.0.0.1:5173/ --select .hero__stage --every 500 --count 34 --gate < /dev/null   # the loop
```

Add `--width 1024`, `820` or `390` for the other designs and `--dark` for the dark theme. Filming uses `playwright-core` and a locally installed Chrome. `src/stage/REHEARSAL.md` records how the hero was built and checked.

## Licenses

The site is MIT licensed; see `LICENSE`. The Stageshow kit (`src/kit`) and its filming scripts (`scripts/`) are MIT licensed; see `src/kit/LICENSE`, `src/kit/NOTICE.md` and `scripts/LICENSE`.
