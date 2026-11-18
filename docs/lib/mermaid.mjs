// Renders a Mermaid chart to an SVG string at build time, themed by Fumadocs' CSS variables.
import { renderMermaidSVG } from 'beautiful-mermaid';

// beautiful-mermaid always inlines Google Fonts @import rules: drop them, so a page loads no third-party style or font.
const FONT_IMPORT = /@import url\('https:\/\/fonts\.googleapis\.com\/[^']*'\);/g;

/** @param {string} chart */
export function renderMermaid(chart) {
  return renderMermaidSVG(chart, {
    bg: 'var(--color-fd-background)',
    fg: 'var(--color-fd-foreground)',
    transparent: true,
  }).replace(FONT_IMPORT, '');
}
