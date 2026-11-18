// Content step: writes content/docs/ from badil's docs/*.md at the tag pinned in docs/badil-version
// (or BADIL_REF), and the tag to .badil-ref. Run by `npm run build` before `next build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { rewriteLinks, slugOf } from './links.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const VERSION_FILE = 'docs/badil-version';
const TAG = /^v[0-9]+\.[0-9]+\.[0-9]+$/;
const ORDER = ['install', 'architecture', 'contract'];
const HOME_INTRO = 'Install, run and integrate badil, the preview environments for Kubernetes and Argo CD.';

async function resolveTag() {
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

const frontmatter = (title) => `---\ntitle: ${JSON.stringify(title)}\n---\n\n`;

const tag = await resolveTag();
const tree = await fetchTree(tag);
const files = tree.filter((e) => e.type === 'blob' && /^docs\/[^/]+\.md$/.test(e.path)).map((e) => e.path);

const outDir = `${root}content/docs/`;
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const titles = new Map();
for (const path of files) {
  const markdown = await fetchDoc(tag, path);
  const newline = markdown.indexOf('\n');
  const first = newline === -1 ? markdown : markdown.slice(0, newline);
  const h1 = /^# (.+)$/.exec(first.trimEnd());
  if (!h1) throw new Error(`${path} at ${tag}: the first line is not a "# " H1 title`);

  const title = h1[1].trim();
  const slug = slugOf(path.slice('docs/'.length));
  const body = rewriteLinks(newline === -1 ? '' : markdown.slice(newline + 1), { file: path, tag, tree });
  await writeFile(`${outDir}${slug}.md`, frontmatter(title) + body);
  titles.set(slug, title);
}

const slugs = [
  ...ORDER.filter((slug) => titles.has(slug)),
  ...[...titles.keys()].filter((slug) => !ORDER.includes(slug)).sort(),
];
await writeFile(`${outDir}meta.json`, `${JSON.stringify({ pages: ['index', ...slugs] }, null, 2)}\n`);

// Links are /<slug>: next/link adds the /docs basePath.
const home = slugs.map((slug) => `- [${titles.get(slug)}](/${slug})`).join('\n');
await writeFile(`${outDir}index.mdx`, `${frontmatter('badil docs')}${HOME_INTRO}\n\n${home}\n`);

await writeFile(`${root}.badil-ref`, `${tag}\n`);
console.log(`content: ${slugs.length} pages from badilhq/badil ${tag}`);
