// Copies the docs export (docs/out/) into the site build at dist/docs/ and writes
// dist/docs/version.json with the badil tag the docs were built at. Run by the root `npm run build`.
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const docs = fileURLToPath(new URL('..', import.meta.url));
const target = fileURLToPath(new URL('../../dist/docs/', import.meta.url));

const tag = (await readFile(`${docs}.badil-ref`, 'utf8')).trim();
await rm(target, { recursive: true, force: true });
await cp(`${docs}out/`, target, { recursive: true });
await writeFile(`${target}version.json`, `${JSON.stringify({ badil: tag })}\n`);
console.log(`dist: docs at badil ${tag} copied to dist/docs/`);
