---
name: badil
description: Per-pull-request full-stack previews, self-hosted on your CI, gitops repo and Argo CD.
colors:
  paper: "#ffffff"
  canvas-gray: "#f6f7f8"
  hairline: "#e3e5e8"
  hairline-strong: "#cfd3d8"
  slate-text: "#4b5158"
  ink: "#111315"
  faint-slate: "#6b7178"
  status-green: "#0a7a3a"
  selection-green: "rgba(10, 122, 58, 0.16)"
  code-well: "#f1f2f4"
  pin-amber: "#8a5300"
  pin-amber-soft: "#fdf1d8"
  ink-hover: "#2a2d31"
  night: "#0b0d0b"
  night-canvas: "#111511"
  night-hairline: "#232823"
  night-hairline-strong: "#343a34"
  night-text: "#a3aca2"
  night-ink: "#e8ece7"
  night-faint: "#7d867c"
  terminal-green: "#3ddc84"
  night-code-well: "#1c211c"
  night-pin-amber: "#f2b23e"
typography:
  display:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(36px, 3.9vw, 54px)"
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(26px, 2.6vw, 36px)"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.024em"
  title:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.6
  mono:
    fontFamily: "ui-monospace, SF Mono, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.84em"
    fontWeight: 400
  wordmark:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 650
    letterSpacing: "-0.02em"
  wordmark-small:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 650
  button:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "-0.005em"
  ui:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  ui-small:
    fontFamily: "ui-monospace, SF Mono, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
  chip:
    fontFamily: "Schibsted Grotesk Variable, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "20px"
rounded:
  code: "5px"
  panel: "10px"
  stage: "16px"
  pill: "999px"
  focus: "4px"
spacing:
  gutter: "32px"
  gutter-phone: "20px"
  section: "clamp(80px, 10vw, 136px)"
  content-max: "1184px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-quiet:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "46px"
  nav-link:
    textColor: "{colors.slate-text}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
  theme-toggle:
    textColor: "{colors.faint-slate}"
    rounded: "{rounded.pill}"
    size: "28px"
  theme-toggle-pressed:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.ink}"
  inline-code:
    backgroundColor: "{colors.code-well}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.code}"
    padding: "2px 4px"
  file-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
  evidence-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
    padding: "16px"
  status-chip:
    textColor: "{colors.status-green}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  pin-code:
    backgroundColor: "{colors.pin-amber-soft}"
    textColor: "{colors.pin-amber}"
    rounded: "{rounded.code}"
    padding: "0 8px"
  hero-panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.stage}"
    padding: "28px 0"
---

# Design System: badil

## Overview

**Creative North Star: "The Category Standard"**

badil's site is a product page at the craft of the infrastructure tools its readers already trust: white ground, ink type, hairline borders, and the product itself shown at real scale. The page is the quiet frame; the illustrations (the live preview loop and the pull request still) are where the product's colour and detail live. Nothing on the page dresses up as a terminal or a dashboard: there is no mono costume, no grid background, no numbered panels.

Density is generous. Sections breathe on a large vertical rhythm, one idea per section, with a heading and its lead on the left and the evidence on the right. Depth is almost absent: everything is flat and separated by 1px hairlines, with one soft shadow reserved for the product panel in the hero.

Light and dark are equal citizens. Light is neutral gray on white; dark is green-tinted near-black, so the terminal green reads as native to the ground. A three-way theme control (System, Light, Dark) switches the page and every illustration together.

**Key Characteristics:**
- White ground (dark: green-tinted near-black), ink text, 1px hairlines.
- One green, meaning live/healthy/ready; one amber, meaning a pinned commit.
- One face, Schibsted Grotesk, for all text; the system mono for code only.
- Pill buttons and chips, 10px panels, a 16px stage frame.
- Flat everywhere except the hero's product panel.

## Colors

A neutral, near-monochrome palette whose only hues are status signals borrowed from the product.

### Primary
- **Status Green** (light `status-green`, dark `terminal-green`): means live, healthy, ready, or "this preview exists". Used for ready dots, "Synced · Healthy" text, the `preview` label chip, links inside the PR comment, the dashed twin of the mark, and the text caret. Never a button fill, never a section background.

### Secondary
- **Pin Amber** (light `pin-amber` on `pin-amber-soft`, dark `night-pin-amber` on a 14% tint): marks a pinned commit SHA, and only that.

### Neutral
- **Paper** (`paper`) / **Night** (`night`): the page ground.
- **Canvas Gray** (`canvas-gray`) / **Night Canvas** (`night-canvas`): tinted sections (the pull request section) and the file card's path bar; also the dark panel surface.
- **Hairline** (`hairline`) / **Night Hairline**: every border and divider. **Hairline Strong** (`hairline-strong`): scrollbar thumb and the loop's routes.
- **Ink** (`ink`) / **Night Ink** (`night-ink`): headings, strong text, the primary button fill (inverted in dark: the button is light on near-black).
- **Slate Text** (`slate-text`) / **Night Text** (`night-text`): body copy.
- **Faint Slate** (`faint-slate`) / **Night Faint** (`night-faint`): step numerals, inactive theme icons, metadata and SHAs in mockups.
- **Code Well** (`code-well`) / **Night Code Well**: inline code background and the pressed theme button.

The illustrations (`src/stage/tokens.css`, `src/stage/pr-still.css`) carry their own `--ss-*` set whose values equal the page's in both themes: accent, amber, hairline, dark ground and neutrals. A stage uses its `--ss-*` tokens, and they match the page tokens.

### Named Rules
**The Product Owns the Green Rule.** Green is a status, not a brand fill. It appears where the product would show it (ready, healthy, labelled, linked) and on the mark's dashed twin (the preview, the double of production); it never fills a button, a section or a heading.

**The Amber Means Pinned Rule.** Amber marks a pinned commit and nothing else. No warnings, no highlights.

## Typography

**Display Font:** Schibsted Grotesk Variable (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Schibsted Grotesk Variable
**Label/Mono Font:** system mono stack (ui-monospace, SF Mono, Menlo, Consolas), for code only

**Character:** One grotesk carries everything, tightened and heavy (650) at heading sizes, open and plain at body size. Mono appears only where the content is literally code: SHAs, paths, labels, YAML.

### Hierarchy
- **Display** (650, clamp(36px, 3.9vw, 54px), 1.04, -0.032em): the hero headline only; max 30ch, balanced wrap.
- **Headline** (650, clamp(26px, 2.6vw, 36px), 1.12, -0.024em): one per section.
- **Title** (600, 18px, 1.35, -0.01em): step titles, evidence terms, the comparison heading.
- **Lede** (400, 20px; 18px on phones, 1.55): the hero sentence, max 36em.
- **Body** (400, 17px, 1.6): all copy; measures held between 26em and 62ch.
- **Label** (500, 15px): nav and footer links. Buttons use 600, 16px, -0.005em.
- **Mono** (0.84em inline; 12px in panels): code, paths, SHAs. Inline identifiers never wrap.

The `wordmark` (19px), `wordmark-small` (16px) and `button` (16px) roles size the wordmark and buttons; `ui` (13px), `ui-small` (12px mono) and `chip` (12px) size the product fragments: the file panel, the evidence panels and the chips.

### Named Rules
**The Mono Is Code Rule.** Mono is set only on text that is literally code or a git identifier. Headings, labels and UI chrome are always in the grotesk.

## Layout

A centred column of 1184px max with a 32px gutter (20px under 600px). Sections stack on a fluid rhythm (clamp(80px, 10vw, 136px) top and bottom), separated by hairlines or a full-bleed canvas tint.

The working pattern is the split: heading and lead on the left (4fr, or 5fr when it carries the file card), content on the right (7fr), 56-72px apart; it collapses to one column at 960px. The evidence row is three equal columns (40px row, 32px column gaps), one column at 960px. The pull request section pairs copy, top-aligned, with the still at its 680px design width, stacking at 1119px. The close is the one centred block. Spacing steps are multiples of 4px; 2px is the hairline step of the theme control, the gap between wrapped illustration rows and the vertical padding of inline code.

The hero is left-aligned copy above the live loop. At 1148px and wider the loop sits in the framed hero panel; below that the frame drops and the loop's tablet and phone designs sit on the page ground, edge to edge (16px gutter on phones so the 358px phone design shows at 1:1).

Breakpoints: 1147px (hero frame off), 1119px (PR stacks), 960px (splits and evidence stack), 599px (phone gutter, nav shows the mark alone).

## Elevation & Depth

Flat by default: depth is made with hairlines and the canvas tint, not shadows. One shadow exists on the page, the hero panel's soft offset (`--panel-shadow`); in dark it becomes a faint inset top highlight over a deep drop. Inside the illustrations, surfaces are separated by 1px hairline rings drawn as box-shadows, never soft shadows.

### Shadow Vocabulary
- **Product panel** (`0 1px 2px rgba(16,20,24,0.04), 0 24px 48px -28px rgba(16,20,24,0.22)`): the hero's product panel only, at 1148px and up.
- **Hairline ring** (`0 0 0 1px` the stage line color): illustration windows and cards.

### Named Rules
**The One Shadow Rule.** The hero's product panel carries the page's only shadow. Every other surface is flat, bordered by a hairline.

## Shapes

Rounded but disciplined, four radii. Pill (999px) for anything you press or that labels state: buttons, the theme control, chips, ready badges. Panel (10px) for content cards: the file card, the evidence mockups, the PR comment card. Stage (16px) for the frames around an illustration: the hero panel and the PR still's crop. Code (5px) for inline code and pinned SHAs. Borders are always 1px hairlines; dots are circles. The PR still runs off the bottom under an 80px fade rather than being cut mid-line.

`focus` (4px) is the focus ring's radius.

## Components

### Buttons
Plain and confident: one ink pill, one quiet text link.
- **Shape:** full pill (999px), 46px tall.
- **Primary:** ink fill, paper text (inverted in dark), 0 24px padding, 600 16px. One per section at most; it always points to the install guide.
- **Hover / Focus:** fill lightens to `ink-hover` over 0.15s ease-out; press nudges down 1px. Focus is a 2px ink outline offset 3px with a 4px radius, shared by every focusable element.
- **Quiet:** ink text, no fill, 0 8px padding; underlines on hover. Secondary destinations (GitHub, the essay).

### Chips
- **Style:** pill, green text on a 12% green tint, 600 12px, 20px line. Used for the `preview` label in mockups.
- **Pin code:** mono SHA on amber-soft with amber text, 5px radius.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** paper (dark: night canvas).
- **Shadow Strategy:** none; a 1px hairline border.
- **Internal Padding:** 16px. The file card adds a canvas path bar in 12px mono over 12px/1.7 mono code.

### Navigation
Sticky 64px bar, paper at 92% with a saturate(1.4) blur(10px) backdrop and a hairline below. Wordmark left (mark + "badil", 650 19px); right, label-weight links in slate that go ink on hover, then the theme control: three 28px icon buttons in a hairline pill, the pressed one on the code well. On phones the wordmark shows the mark only.

### Steps
A numbered list where the sequence carries meaning: each step is a row between hairlines, a faint 18px tabular numeral in a 36px column beside a title and its body.

### Evidence mockup
Above each claim, a small 10px hairline panel (min 104px tall, 13px) recreating the artifact that proves it: PR rows with label chips, a CI row with a pinned SHA, a gitops commit and a healthy Application. Real names neutralised.

### Illustration stages
The live loop and the pull request still are self-contained stages (`.ss-stage`) with their own `--ss-*` tokens that mirror the page palette in both themes; the loop's motion and layout are locked and not part of this system. The PR still renders badil's comment as a GitHub-flavoured markdown table (header row on the card-head tint, hairline rows, mono SHAs, green links).

## Do's and Don'ts

### Do:
- **Do** keep the page on paper/night with hairline (`#e3e5e8` / `#232823`) borders and let the illustrations carry the colour.
- **Do** use green only for live, healthy, ready, labelled or linked states, and amber only for pinned commits.
- **Do** use the ink pill for the single primary action and a quiet text link beside it.
- **Do** set every text in Schibsted Grotesk and reserve mono for code, paths and SHAs.
- **Do** switch the page and every illustration together when the theme changes.

### Don't:
- **Don't** add a second shadow; the hero product panel owns the only one.
- **Don't** fill buttons, sections or headings with green.
- **Don't** put eyebrows or kickers above headings, grid backgrounds, numbered decorative panels, or mono-set UI chrome.
- **Don't** frame the loop below 1148px; the smaller designs sit on the page ground.
