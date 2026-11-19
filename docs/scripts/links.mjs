// Rewrites the links of one doc for the site: pure, no network, unit tested in links.test.mjs.
// A doc is one of badil's docs/*.md or badilhq/quickstart's README.md; its relative links resolve
// against the tree of its own repository. Links come from the Markdown syntax tree, so link-shaped
// text in code is never touched.
import { posix } from 'node:path';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfm } from 'micromark-extension-gfm';
import { visit } from 'unist-util-visit';

const BADIL = 'badilhq/badil';
const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;
const DOC = /^docs\/([^/]+)\.md$/;

/** The site slug of a badil docs file name: `INSTALL.md` → `install`. */
export function slugOf(fileName) {
  return fileName.replace(/\.md$/, '').toLowerCase();
}

/**
 * @param {string} markdown one doc's Markdown
 * @param {object} options
 * @param {string} [options.repo] the repository (owner/name) the doc is read from, `badilhq/badil` by default
 * @param {string} options.file the doc's path in that repository, e.g. `docs/INSTALL.md`
 * @param {string} options.tag the tag or commit the doc is read at
 * @param {{ path: string, type: string }[]} options.tree the repository tree at that tag or commit
 * @returns {string} the Markdown with every link and definition rewritten; only badil's docs/*.md
 *   become site paths, every other target a GitHub URL pinned to the tag or commit
 */
export function rewriteLinks(markdown, { repo = BADIL, file, tag, tree }) {
  const types = new Map(tree.map((entry) => [entry.path, entry.type]));
  const base = posix.dirname(file);

  const rewrite = (url) => {
    if (url.startsWith('#') || SCHEME.test(url)) return url;

    const hash = url.indexOf('#');
    const target = hash === -1 ? url : url.slice(0, hash);
    const anchor = hash === -1 ? '' : url.slice(hash);
    // GitHub resolves `/x` from the repo root and `x` against the doc's folder.
    const path = posix
      .normalize(target.startsWith('/') ? target.slice(1) : posix.join(base, target))
      .replace(/\/+$/, '');

    const type = path.startsWith('..') ? undefined : types.get(path);
    if (type === undefined) {
      throw new Error(`${file}: link "${url}" points to ${path}, which is not in ${repo} at ${tag}`);
    }

    const doc = repo === BADIL && type === 'blob' && DOC.exec(path);
    if (doc) return `/${slugOf(`${doc[1]}.md`)}${anchor}`;
    return `https://github.com/${repo}/${type === 'tree' ? 'tree' : 'blob'}/${tag}/${path}${anchor}`;
  };

  const ast = fromMarkdown(markdown, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  visit(ast, (node) => {
    if (node.type === 'link' || node.type === 'definition') node.url = rewrite(node.url);
  });
  return toMarkdown(ast, { extensions: [gfmToMarkdown()] });
}
