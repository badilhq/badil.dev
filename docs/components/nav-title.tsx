'use client';
import type { ComponentProps } from 'react';

// A plain <a>, not next/link: next/link would prefix basePath and point the wordmark at /docs/.
export function NavTitle(props: ComponentProps<'a'>) {
  return (
    <a {...props} href="/">
      badil
    </a>
  );
}
