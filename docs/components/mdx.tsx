import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ArchitectureMap, InstallCard } from '@/components/home';
import { CodeFrame } from '@/components/mdx/code-frame';
import { Mermaid } from '@/components/mdx/mermaid';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Fenced code: the framed panel with a bar and a Copy pill, instead of Fumadocs' CodeBlock.
    pre: CodeFrame,
    Mermaid,
    InstallCard,
    ArchitectureMap,
    ...components,
  } satisfies MDXComponents;
}
