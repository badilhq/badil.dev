---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/site.css","src/stage/PrStill.tsx"]
---

# badil.dev landing page

Scope: the landing page (`src/App.tsx`, `src/site.css`, the illustrations' styles). Mode: Persuade.

Audience and job: platform engineers and SREs on Kubernetes and Argo CD, deciding whether to self-host per-pull-request previews. Action: read the install guide. Proof: the live preview loop (locked), badil's pull request comment (improved, GitHub-flavored markdown, neutral names), the gitops file it writes. Constraints: the hero animation's motion, choreography and layout are locked and its rehearsal gates must pass; no invented claims; no agent-specific feature claimed.

## Direction contract

THESIS: The category standard, executed at the craft of Cursor, Railway, Vercel and Temporal: a product page that shows the real preview loop at real scale and says plainly why agents and people need a preview per pull request. It refuses the decorated tool page: mono costume, numbered panels, grid backgrounds, eyebrows.

OWN-WORLD: Restrained. White ground (dark: near-black), ink text, hairline borders, one green that lives inside the product only (statuses), amber for pinned commits. Schibsted Grotesk for all text, system mono only for code. Pill buttons, 10px panels, one soft offset shadow on the product panel.

STORY: Every pull request gets its own full-stack preview from the team's own CI, gitops repo and Argo CD, so agents and people run QA before merging; it fits what they already run; they open the install guide.

FIRST VIEWPORT: Nav: wordmark left; Install guide, GitHub, theme control right. Left-aligned two-line headline about 56px, one sentence, ink pill "Read the install guide" and a quiet GitHub link. Below, the live loop in a large soft panel spanning the content width, its top visible inside 1280x800.

FORM: canon (the standing exit, not on the ordered list), against Cursor, Railway, Vercel and Temporal; seed: seed:38f09db6efb1fef2. Signature interaction: the live preview loop itself, unchanged.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
