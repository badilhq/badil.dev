// Sorts badil's pages into the docs tabs: pure, no network, unit tested in tabs.test.mjs.
// Each tab is a Fumadocs root folder, `(<id>)/meta.json` with `root: true`; the parentheses keep
// the folder out of the page URLs, so a page stays at /docs/<slug>.

/** The tabs in display order, and the pages each one lists first, in reading order. */
export const TABS = [
  { id: 'guide', title: 'Guide', pages: ['quickstart', 'install'] },
  { id: 'concepts', title: 'Concepts', pages: ['architecture', 'contract'] },
  {
    id: 'reference',
    title: 'Reference',
    pages: ['configuration', 'api', 'events', 'services', 'cleanup', 'operations'],
  },
];

/** A page no tab lists goes to Reference, after the listed ones, so a new badil page never breaks the build. */
const FALLBACK = 'reference';

/**
 * @param {string[]} slugs the page slugs at the badil ref being built
 * @returns {{ id: string, title: string, folder: string, pages: string[] }[]} the tabs that hold at least
 *   one page, in display order, each with its pages in reading order
 */
export function groupPages(slugs) {
  const listed = new Set(TABS.flatMap((tab) => tab.pages));
  const extra = slugs.filter((slug) => !listed.has(slug)).sort();
  return TABS.map((tab) => ({
    id: tab.id,
    title: tab.title,
    folder: `(${tab.id})`,
    pages: [...tab.pages.filter((slug) => slugs.includes(slug)), ...(tab.id === FALLBACK ? extra : [])],
  })).filter((tab) => tab.pages.length > 0);
}
