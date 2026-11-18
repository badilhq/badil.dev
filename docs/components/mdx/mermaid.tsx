import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { renderMermaid } from '@/lib/mermaid.mjs';

// Server component: the SVG is in the static HTML, with no client-side Mermaid.
export function Mermaid({ chart }: { chart: string }) {
  let svg: string;
  try {
    svg = renderMermaid(chart);
  } catch {
    return (
      <CodeBlock title="Mermaid">
        <Pre>{chart}</Pre>
      </CodeBlock>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
