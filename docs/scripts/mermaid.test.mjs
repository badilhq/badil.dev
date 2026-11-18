import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderMermaid } from '../lib/mermaid.mjs';

test('a flowchart renders to an SVG themed by Fumadocs, with no third-party font or script', () => {
  const svg = renderMermaid('flowchart LR\n  a["writes previews/&lt;slug&gt;"] --> b[("gitops repo")]\n');
  assert.match(svg, /^<svg /);
  assert.match(svg, /--bg:var\(--color-fd-background\);--fg:var\(--color-fd-foreground\)/);
  assert.match(svg, /previews\/&lt;slug&gt;/);
  assert.doesNotMatch(svg, /@import|https?:\/\/(?!www\.w3\.org\/)|<script/);
});

test('an invalid chart throws, so the component falls back to a code block', () => {
  assert.throws(() => renderMermaid('not a diagram'), /Invalid mermaid header/);
});
