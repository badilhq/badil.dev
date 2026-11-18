---
version: 1
slug: "docs-app-docs-layout-tsx"
primary_target: "docs/app/(docs)/layout.tsx"
related_targets: ["docs/app/global.css","docs/app/(docs)/[[...slug]]/page.tsx","docs/components/mdx.tsx"]
---

# Surface: badil.dev docs (/docs)

Mode: Read (and Operate for Install). Audience: platform engineers and SREs. Job: understand badil and finish the install; look details up in the references. Constraints: page text is badil's own docs/*.md (content pipeline locked); official Mermaid renderer; all assets under /docs/_next/ except the beacon; landing page and its rehearsal gates untouched; widths 1440, 1024, 820, 390, light and dark.

## Direction contract

THESIS: The docs are sorted by what a page is for: Guide (Install), Concepts (Architecture, Preview contract) and Reference (Configuration, HTTP API, Pull request events, Services and dependencies, Cleanup and config sync, Operations), each a top tab with its own short sidebar. The docs home (/docs) is the architecture map: Start with Install, then the flow GitHub → badil → gitops repo → Argo CD → preview namespace, each node linking to its pages. It refuses one long undifferentiated sidebar and a grey Fumadocs default.

OWN-WORLD: badil's landing system carried into a reading frame: Schibsted Grotesk for all text, system mono for code only, ink on paper (dark: green-tinted night), 1px hairlines, status green only for links, the active marker and live states, pin amber only for pinned SHAs, code-well inline code, 10px framed code panels with a file bar and a pill Copy button and restrained syntax colour.

STORY: A reader lands on Install, sees the numbered steps in the sidebar and the on-this-page rail, copies each block, and reaches a working preview; the Concepts and Reference tabs answer how and what without crowding the guide.

FIRST VIEWPORT: 64px header (mark + "badil | Docs", search ⌘K, badil.dev, GitHub, three-way theme pill); 46px tab bar Guide / Concepts / Reference with an ink underline on the active tab; left sidebar of the tab's pages and numbered Install steps; a ~65ch column with the H1, lead paragraph, numbered section headings and a framed code block; right "On this page" rail with the current heading marked.

FORM: Tabs by content type, position 2 of 7 on the ordered list; seed:8719ee4df2653bb5.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Chosen sketch: .impeccable/mocks/decision/tabs-by-type.html for pages (picked 2026-11-18); docs home from .impeccable/mocks/decision/map-led.html (the map and Start with Install card only, under the tabs header, not its component-grouped sidebar).
