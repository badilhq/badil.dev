'use client';

import { use, useId, useSyncExternalStore } from 'react';
import { CodeFrame } from '@/components/mdx/code-frame';
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

// The site palette (DESIGN.md) as Mermaid's `base` theme variables, which take literal colours only.
const FONT = "'Schibsted Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif";
const THEME_VARIABLES = {
  light: {
    darkMode: false,
    fontFamily: FONT,
    background: '#ffffff',
    primaryColor: '#ffffff',
    primaryTextColor: '#111315',
    primaryBorderColor: '#cfd3d8',
    secondaryColor: '#f6f7f8',
    tertiaryColor: '#f6f7f8',
    lineColor: '#4b5158',
    textColor: '#111315',
    clusterBkg: '#f6f7f8',
    clusterBorder: '#cfd3d8',
    edgeLabelBackground: '#ffffff',
    titleColor: '#111315',
  },
  dark: {
    darkMode: true,
    fontFamily: FONT,
    background: '#0b0d0b',
    primaryColor: '#111511',
    primaryTextColor: '#e8ece7',
    primaryBorderColor: '#343a34',
    secondaryColor: '#111511',
    tertiaryColor: '#111511',
    lineColor: '#a3aca2',
    textColor: '#e8ece7',
    clusterBkg: '#0b0d0b',
    clusterBorder: '#343a34',
    edgeLabelBackground: '#0b0d0b',
    titleColor: '#e8ece7',
  },
};

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
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    fontFamily: 'inherit',
    theme: 'base',
    themeVariables: THEME_VARIABLES[theme],
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
      <CodeFrame title="Mermaid">
        <code>{chart}</code>
      </CodeFrame>
    );
  }

  // mermaid sizes the SVG to the column (width 100%, max-width its natural width), so it never overflows it.
  return (
    <div className="my-6 overflow-x-auto [&_svg]:mx-auto" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
