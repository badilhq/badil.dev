import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Static export served by the badil.dev Worker under /docs (copied to dist/docs/ by scripts/dist.mjs).
  output: 'export',
  basePath: '/docs',
  images: { unoptimized: true },
  reactStrictMode: true,
  // docs/ is its own npm project beside the landing's: keep Turbopack from picking the repo root.
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
};

export default withMDX(config);
