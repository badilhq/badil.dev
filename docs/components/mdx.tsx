import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { ArchitectureMap, InstallCard } from '@/components/home';
import { CodeFrame } from '@/components/mdx/code-frame';
import { Mermaid } from '@/components/mdx/mermaid';

// Inline code that is a command or a message (a space and over 24 characters), or any code over 48
// characters, is marked data-wrap and may wrap (app/global.css); identifiers never do. Fenced code reaches
// here too, with Shiki's line spans as children, and is unchanged.
function wraps(text: string) {
  return (/\s/.test(text) && text.length > 24) || text.length > 48;
}

function Code(props: ComponentProps<'code'>) {
  const wrap = typeof props.children === 'string' && wraps(props.children);
  return <code {...props} data-wrap={wrap || undefined} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Fenced code: the framed panel with a bar and a Copy pill, instead of Fumadocs' CodeBlock.
    pre: CodeFrame,
    code: Code,
    Mermaid,
    InstallCard,
    ArchitectureMap,
    ...components,
  } satisfies MDXComponents;
}
