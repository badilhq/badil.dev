// Content step: writes content/docs/ from badil's docs/*.md at the tag pinned in docs/badil-version
// (or BADIL_REF), and the tag to .badil-ref. Run by `npm run build` before `next build`.
//
// The quickstart page, /docs/quickstart, is badilhq/quickstart's README.md at the commit pinned in
// docs/quickstart-version; a docs/QUICKSTART.md at the badil ref is skipped.
//
// Layout written: one root folder per tab, `(guide)/`, `(concepts)/`, `(reference)/` (scripts/tabs.mjs),
// each with a `meta.json` holding `root: true`; the parentheses keep pages at /docs/<slug>. The docs
// home, index.mdx, is site-owned text.
//
// Local preview only: BADIL_DEV_REF=<branch> builds the content from any badil ref (a branch under
// review, say) for `next dev`. It is refused under `npm run build`, so a shipped build always comes
// from a release tag.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { rewriteLinks, slugOf } from './links.mjs';
import { groupPages } from './tabs.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const VERSION_FILE = 'docs/badil-version';
const QUICKSTART_VERSION_FILE = 'docs/quickstart-version';
const BADIL = 'badilhq/badil';
const QUICKSTART = 'badilhq/quickstart';
const QUICKSTART_SLUG = 'quickstart';
const QUICKSTART_TITLE = 'Quickstart';
const SHA = /^[0-9a-f]{40}$/;
const TAG = /^v[0-9]+\.[0-9]+\.[0-9]+$/;
const DEV_REF = /^[A-Za-z0-9._/-]+$/;

// Site-owned text of the docs home. Facts: badil docs/ARCHITECTURE.md.
const HOME_TITLE = 'Overview';
const HOME_DESCRIPTION =
  'How to install and run badil, which writes a preview environment for each labelled pull request to your gitops repo for Argo CD to deploy.';
const HOME_INTRO =
  'badil turns a labelled pull request into a preview environment: it writes the preview to your gitops repo, and Argo CD deploys it.';
const INSTALL_SUMMARY = 'From an empty cluster to a first preview: the gitops repo, Argo CD, the GitHub App and the `badil` chart.';

async function resolveRef() {
  const dev = process.env.BADIL_DEV_REF;
  if (dev) {
    if (process.env.npm_lifecycle_event === 'build') {
      throw new Error('BADIL_DEV_REF is for local preview only; a build reads the release tag in docs/badil-version');
    }
    if (!DEV_REF.test(dev)) throw new Error(`BADIL_DEV_REF "${dev}" is not a git ref name`);
    return dev;
  }
  const ref = process.env.BADIL_REF;
  if (ref) {
    if (!TAG.test(ref)) throw new Error(`BADIL_REF "${ref}" is not a badil release tag (v<major>.<minor>.<patch>)`);
    return ref;
  }
  let pinned;
  try {
    pinned = (await readFile(`${root}badil-version`, 'utf8')).trim();
  } catch (error) {
    throw new Error(`${VERSION_FILE} cannot be read: ${error.message}`);
  }
  if (!TAG.test(pinned)) {
    throw new Error(`${VERSION_FILE} holds "${pinned}", not a badil release tag (v<major>.<minor>.<patch>)`);
  }
  return pinned;
}

async function quickstartCommit() {
  let pinned;
  try {
    pinned = (await readFile(`${root}quickstart-version`, 'utf8')).trim();
  } catch (error) {
    throw new Error(`${QUICKSTART_VERSION_FILE} cannot be read: ${error.message}`);
  }
  if (!SHA.test(pinned)) {
    throw new Error(`${QUICKSTART_VERSION_FILE} holds "${pinned}", not a badilhq/quickstart commit (40 lowercase hex)`);
  }
  return pinned;
}

async function fetchTree(repo, tag) {
  const url = `https://api.github.com/repos/${repo}/git/trees/${tag}?recursive=1`;
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'badil.dev-docs' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (response.status !== 200) throw new Error(`${repo} tree at ${tag}: HTTP ${response.status} (${url})`);
  const body = await response.json();
  if (body.truncated) throw new Error(`${repo} tree at ${tag} is truncated (${url})`);
  return body.tree.map(({ path, type }) => ({ path, type }));
}

async function fetchDoc(repo, tag, path) {
  const url = `https://raw.githubusercontent.com/${repo}/${tag}/${path}`;
  const response = await fetch(url);
  if (response.status !== 200) throw new Error(`${repo} ${path} at ${tag}: HTTP ${response.status} (${url})`);
  return response.text();
}

/** Splits a doc into its "# " H1 title, which must be its first line, and the rest. */
function splitTitle(markdown, where) {
  const newline = markdown.indexOf('\n');
  const first = newline === -1 ? markdown : markdown.slice(0, newline);
  const h1 = /^# (.+)$/.exec(first.trimEnd());
  if (!h1) throw new Error(`${where}: the first line is not a "# " H1 title`);
  return { title: h1[1].trim(), rest: newline === -1 ? '' : markdown.slice(newline + 1) };
}

const frontmatter = (fields) =>
  `---\n${Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n')}\n---\n\n`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

const tag = await resolveRef();
const sha = await quickstartCommit();
const tree = await fetchTree(BADIL, tag);
const files = tree
  .filter((e) => e.type === 'blob' && /^docs\/[^/]+\.md$/.test(e.path))
  .map((e) => e.path)
  .filter((path) => slugOf(path.slice('docs/'.length)) !== QUICKSTART_SLUG);

const outDir = `${root}content/docs/`;
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const pages = new Map();
for (const path of files) {
  const { title, rest } = splitTitle(await fetchDoc(BADIL, tag, path), `${path} at ${tag}`);
  const slug = slugOf(path.slice('docs/'.length));
  pages.set(slug, { title, body: rewriteLinks(rest, { file: path, tag, tree }) });
}

// The quickstart README's own H1 is dropped: the page title is site-owned.
const quickstartTree = await fetchTree(QUICKSTART, sha);
const readme = splitTitle(await fetchDoc(QUICKSTART, sha, 'README.md'), `${QUICKSTART} README.md at ${sha}`);
pages.set(QUICKSTART_SLUG, {
  title: QUICKSTART_TITLE,
  body: rewriteLinks(readme.rest, { repo: QUICKSTART, file: 'README.md', tag: sha, tree: quickstartTree }),
});

const tabs = groupPages([...pages.keys()]);
for (const tab of tabs) {
  const dir = `${outDir}${tab.folder}/`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}meta.json`, json({ title: tab.title, root: true, pages: tab.pages }));
  for (const slug of tab.pages) {
    const { title, body } = pages.get(slug);
    await writeFile(`${dir}${slug}.md`, frontmatter({ title }) + body);
  }
}
await writeFile(`${outDir}meta.json`, json({ pages: ['index', ...tabs.map((tab) => tab.folder)] }));

// Links are /<slug>: next/link adds the /docs basePath. The map links each node to the pages present at this ref.
const home = [
  HOME_INTRO,
  pages.has('install') ? `<InstallCard href="/install">${INSTALL_SUMMARY}</InstallCard>` : '',
  '<ArchitectureMap />',
]
  .filter(Boolean)
  .join('\n\n');
await writeFile(
  `${outDir}index.mdx`,
  `${frontmatter({ title: HOME_TITLE, description: HOME_DESCRIPTION, full: true })}${home}\n`,
);

await writeFile(`${root}.badil-ref`, `${tag}\n`);
console.log(`content: ${pages.size} pages in ${tabs.length} tabs from badilhq/badil ${tag}`);
console.log(`content: quickstart from ${QUICKSTART} ${sha}`);
