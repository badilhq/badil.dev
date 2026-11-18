import { isValidElement, type ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { getLayoutTabs } from 'fumadocs-ui/layouts/shared';
import { SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import type * as PageTree from 'fumadocs-core/page-tree';
import { GitHubIcon, SearchPill, ThemeControl } from '@/components/chrome';
import { NavTitle } from '@/components/nav-title';
import { SidebarPageItem, StepsProvider, type Step } from '@/components/sidebar';
import { source } from '@/lib/source';

const REPO = 'https://github.com/badilhq/badil';

function pageUrls(folder: PageTree.Folder): string[] {
  return folder.children.flatMap((node) =>
    node.type === 'page' ? [node.url] : node.type === 'folder' ? pageUrls(node) : [],
  );
}

// The tabs are the root folders content.mjs writes, `(guide)` / `(concepts)` / `(reference)`. Bound by
// their page URLs instead of the tree node, they also show on the docs home, which sits in no tab.
function tabs(tree: PageTree.Root) {
  return getLayoutTabs(tree, {
    transform: ({ $folder: _folder, ...tab }, node) => ({ ...tab, urls: new Set(pageUrls(node)) }),
  });
}

// "## 1. Prerequisites" headings make a page's numbered steps, listed under it in the sidebar.
const STEP = /^(\d+)\.\s+(.+?)(\s+\(optional\))?$/;

// A TOC title is a React node (Fumadocs MDX compiles headings to JSX): its plain text.
function text(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return text(node.props.children);
  return '';
}

function steps(): Record<string, Step[]> {
  const out: Record<string, Step[]> = {};
  for (const page of source.getPages()) {
    const list = page.data.toc.flatMap((item) => {
      const match = item.depth === 2 ? STEP.exec(text(item.title)) : null;
      return match ? [{ anchor: item.url, n: match[1], title: match[2], optional: Boolean(match[3]) }] : [];
    });
    if (list.length >= 3) out[page.url] = list;
  }
  return out;
}

export default function Layout({ children }: { children: ReactNode }) {
  const tree = source.getPageTree();
  return (
    <StepsProvider steps={steps()}>
      <DocsLayout
        tree={tree}
        tabs={tabs(tree)}
        tabMode="navbar"
        nav={{ mode: 'top' }}
        slots={{
          navTitle: NavTitle,
          themeSwitch: ThemeControl,
          searchTrigger: { sm: SearchTrigger, full: SearchPill },
        }}
        sidebar={{ components: { Item: SidebarPageItem }, defaultOpenLevel: 1, collapsible: false }}
        links={[
          // Plain anchors: the landing page is outside the /docs app, and both stay in this tab.
          {
            type: 'custom',
            children: (
              <a className="nav-link" href="/">
                badil.dev
              </a>
            ),
          },
          {
            type: 'custom',
            children: (
              <a className="nav-link" href={REPO}>
                <GitHubIcon />
                GitHub
              </a>
            ),
          },
        ]}
      >
        {children}
      </DocsLayout>
    </StepsProvider>
  );
}
