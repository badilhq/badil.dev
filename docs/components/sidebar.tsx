'use client';
// Sidebar items: Fumadocs' page links, drawn in the badil style. A page with numbered steps (Install's
// "## 1. Prerequisites" headings) lists them under its link, so the guide reads as a sequence.
import { SidebarItem, useSidebar } from 'fumadocs-ui/components/sidebar/base';
import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import Link from 'next/link';
import { createContext, use, type ReactNode } from 'react';

export type Step = { anchor: string; n: string; title: string; optional: boolean };

const StepsContext = createContext<Record<string, Step[]>>({});

/** Steps by page URL, read on the server from each page's table of contents. */
export function StepsProvider({ steps, children }: { steps: Record<string, Step[]>; children: ReactNode }) {
  return <StepsContext value={steps}>{children}</StepsContext>;
}

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

export function SidebarPageItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const active = normalize(pathname) === normalize(item.url);
  // Steps show under the page being read, not across the whole tree (the docs home lists every tab).
  const steps = active ? (use(StepsContext)[item.url] ?? []) : [];

  return (
    <>
      <SidebarItem className="side-item" href={item.url} external={item.external} active={active}>
        {item.name}
      </SidebarItem>
      {steps.length > 0 && (
        <ol className="side-steps">
          {steps.map((step) => (
            <li key={step.anchor}>
              {/* A hash link keeps the pathname, so the phone drawer is closed here. */}
              <Link className="side-steps__link" href={`${item.url}${step.anchor}`} onClick={() => setOpen(false)}>
                <span className="side-steps__n">{step.n}</span>
                <span>
                  {step.title}
                  {step.optional && <span className="side-steps__opt">optional</span>}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
