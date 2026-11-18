import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rewriteLinks } from './links.mjs';

const tag = 'v0.23.0';
const file = 'docs/ARCHITECTURE.md';
const tree = [
  { path: 'docs', type: 'tree' },
  { path: 'docs/ARCHITECTURE.md', type: 'blob' },
  { path: 'docs/INSTALL.md', type: 'blob' },
  { path: 'charts', type: 'tree' },
  { path: 'charts/app', type: 'tree' },
  { path: 'charts/preview-apps', type: 'tree' },
  { path: 'charts/badil/dashboards/badil.json', type: 'blob' },
];
const rewrite = (markdown) => rewriteLinks(markdown, { file, tag, tree });

test('a doc-to-doc link keeps its anchor on the site path', () => {
  assert.equal(rewrite('See [upgrade](INSTALL.md#10-upgrade).\n'), 'See [upgrade](/install#10-upgrade).\n');
});

test('a repo file becomes a blob URL and a directory a tree URL, pinned to the tag', () => {
  assert.equal(
    rewrite('[dashboard](../charts/badil/dashboards/badil.json) and [chart](../charts/preview-apps)\n'),
    `[dashboard](https://github.com/badilhq/badil/blob/${tag}/charts/badil/dashboards/badil.json) and ` +
      `[chart](https://github.com/badilhq/badil/tree/${tag}/charts/preview-apps)\n`,
  );
});

test('absolute URLs and anchor-only links are unchanged', () => {
  const markdown = '[site](https://badil.dev/docs) and [below](#gitops-repo-contract)\n';
  assert.equal(rewrite(markdown), markdown);
});

test('link-shaped text in a code span is untouched', () => {
  const markdown = 'Each row: `· [<host><path>](<scheme>://<host><path>)` per preview.\n';
  assert.equal(rewrite(markdown), markdown);
});

test('a root-anchored target resolves from the repo root', () => {
  assert.equal(rewrite('[app](/charts/app)\n'), `[app](https://github.com/badilhq/badil/tree/${tag}/charts/app)\n`);
});

test('reference definitions are rewritten too', () => {
  assert.equal(rewrite('[Install][i]\n\n[i]: INSTALL.md\n'), '[Install][i]\n\n[i]: /install\n');
});

test('a relative target missing from the tree fails, naming the file and the link', () => {
  assert.throws(
    () => rewrite('[old chart](../charts/preview-env)\n'),
    (error) => error.message.includes(file) && error.message.includes('../charts/preview-env'),
  );
});
