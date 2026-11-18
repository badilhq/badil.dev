import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

// Pages live at the app root: basePath '/docs' (next.config.mjs) serves them at /docs/<slug>.
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});
