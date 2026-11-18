import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { NavTitle } from '@/components/nav-title';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      githubUrl="https://github.com/badilhq/badil"
      slots={{ navTitle: NavTitle }}
    >
      {children}
    </DocsLayout>
  );
}
