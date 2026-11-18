'use client';
// The header's controls, drawn as on the landing (DESIGN.md: Navigation): the search pill, the
// three-way theme control and the plain text links.
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { useTheme } from 'fumadocs-ui/provider/base';
import { useSyncExternalStore, type ComponentProps } from 'react';

export function SearchPill({ className }: ComponentProps<'button'>) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  if (!enabled) return null;
  return (
    <button type="button" className={`search-pill ${className ?? ''}`} onClick={() => setOpenSearch(true)} data-search-full="">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="7" cy="7" r="4.8" />
        <path d="m10.6 10.6 3.4 3.4" strokeLinecap="round" />
      </svg>
      <span className="search-pill__label">Search docs</span>
      <kbd className="search-pill__kbd">
        {hotKey.map((key, i) => (
          <span key={i}>{key.display}</span>
        ))}
      </kbd>
    </button>
  );
}

const THEMES = [
  {
    choice: 'system',
    label: 'System theme',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
        <path d="M5.5 14h5M8 11.5V14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    choice: 'light',
    label: 'Light theme',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" />
      </svg>
    ),
  },
  {
    choice: 'dark',
    label: 'Dark theme',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
        <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
      </svg>
    ),
  },
] as const;

const noop = () => () => {};

/** System, Light or Dark, as on the landing. The choice is shared with the landing (provider.tsx). */
export function ThemeControl({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const current = mounted ? (theme ?? 'system') : null;
  return (
    <div className={`theme-control ${className ?? ''}`} role="group" aria-label="Theme">
      {THEMES.map(({ choice, label, icon }) => (
        <button
          key={choice}
          type="button"
          className="theme-control__btn"
          aria-label={label}
          title={label}
          aria-pressed={current === choice}
          onClick={() => setTheme(choice)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

export function GitHubIcon() {
  return (
    <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
