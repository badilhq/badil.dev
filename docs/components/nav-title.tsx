'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { Mark } from '@/components/mark';

// The landing's wordmark, a hairline, then "Docs". The wordmark is a plain <a> to the landing page:
// next/link would prefix basePath and point it at /docs/. "Docs" goes to the docs home.
export function NavTitle({ className }: ComponentProps<'a'>) {
  return (
    <span className={`nav-title ${className ?? ''}`}>
      <a className="nav-title__wordmark" href="/" aria-label="badil home">
        <Mark />
        <span>badil</span>
      </a>
      <span className="nav-title__rule" aria-hidden />
      <Link className="nav-title__docs" href="/">
        Docs
      </Link>
    </span>
  );
}
