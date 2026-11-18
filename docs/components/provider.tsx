'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import SearchDialog from '@/components/search';

// The theme choice lives under the landing's storage key, `badil-theme`: picking Light or Dark on
// either page carries over to the other ("system" or no value both mean the system's setting).
export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} theme={{ storageKey: 'badil-theme' }}>
      {children}
    </RootProvider>
  );
}
