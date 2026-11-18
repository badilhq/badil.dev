import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const dynamic = 'force-static';
export const revalidate = false;

// Exported as out/search.json, fetched by the search dialog from /docs/search.json.
export const { staticGET: GET } = createFromSource(source, { language: 'english' });
