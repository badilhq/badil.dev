// Content step: writes content/docs/ from badil's docs/*.md at the tag pinned in docs/badil-version
// (or BADIL_REF), and the tag to .badil-ref. Run by `npm run build` before `next build`.
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

async function fetchTree(tag) {
  const url = `https://api.github.com/repos/badilhq/badil/git/trees/${tag}?recursive=1`;
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'badil.dev-docs' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, { headers });
  if (response.status !== 200) throw new Error(`badilhq/badil tree at ${tag}: HTTP ${response.status} (${url})`);
  const body = await response.json();
  if (body.truncated) throw new Error(`badilhq/badil tree at ${tag} is truncated (${url})`);
  return body.tree.map(({ path, type }) => ({ path, type }));
}

async function fetchDoc(tag, path) {
  const url = `https://raw.githubusercontent.com/badilhq/badil/${tag}/${path}`;
  const response = await fetch(url);
  if (response.status !== 200) throw new Error(`${path} at ${tag}: HTTP ${response.status} (${url})`);
  return response.text();
}

const frontmatter = (fields) =>
  `---\n${Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n')}\n---\n\n`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

const tag = await resolveRef();
const tree = await fetchTree(tag);
const files = tree.filter((e) => e.type === 'blob' && /^docs\/[^/]+\.md$/.test(e.path)).map((e) => e.path);

const outDir = `${root}content/docs/`;
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const pages = new Map();
for (const path of files) {
  const markdown = await fetchDoc(tag, path);
  const newline = markdown.indexOf('\n');
  const first = newline === -1 ? markdown : markdown.slice(0, newline);
  const h1 = /^# (.+)$/.exec(first.trimEnd());
  if (!h1) throw new Error(`${path} at ${tag}: the first line is not a "# " H1 title`);

  const slug = slugOf(path.slice('docs/'.length));
  const body = rewriteLinks(newline === -1 ? '' : markdown.slice(newline + 1), { file: path, tag, tree });
  pages.set(slug, { title: h1[1].trim(), body });
}

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
