import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Provider } from '@/components/provider';
import './global.css';

export const metadata: Metadata = {
  title: { default: 'badil docs', template: '%s | badil' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
        {/* Cloudflare Web Analytics, as on the landing: production builds only, so next dev does not count as visits. */}
        {process.env.NODE_ENV === 'production' && (
          <script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "26515ebfa1264aca94c6f16c3f79b6cc"}'
          />
        )}
      </body>
    </html>
  );
}
