import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Beacon in production builds only, so dev and the rehearsal gates do not count as visits.
    {
      name: 'cloudflare-web-analytics',
      apply: 'build',
      transformIndexHtml: () => [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': '{"token": "26515ebfa1264aca94c6f16c3f79b6cc"}',
          },
          injectTo: 'body',
        },
      ],
    },
  ],
  build: { target: 'es2022' },
  resolve: { dedupe: ['react', 'react-dom'] },
})
