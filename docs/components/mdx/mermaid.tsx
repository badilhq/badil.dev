'use client';

import { use, useId, useSyncExternalStore } from 'react';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { useTheme } from 'fumadocs-ui/provider/base';

// Fumadocs' official Mermaid renderer: mermaid is imported only when a page renders a diagram,
// as a chunk under /docs/_next/, and redrawn in the site's resolved theme.
export function Mermaid({ chart }: { chart: string }) {
  // `false` on the server and during hydration
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'default';
  const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    fontFamily: 'inherit',
    theme,
  });

  const svg = use(
    cachePromise(`${chart}-${theme}`, () =>
      mermaid.render(id, chart).then(
        (result) => result.svg,
        () => null,
      ),
    ),
  );

  if (svg === null) {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }

  // mermaid sizes the SVG to the column (width 100%, max-width its natural width), so it never overflows it.
  return (
    <div className="my-6 overflow-x-auto [&_svg]:mx-auto" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
