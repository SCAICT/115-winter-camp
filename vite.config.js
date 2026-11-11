import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { siteSeo, structuredData } from './src/data/siteSeo.js';

const meta = (name, content) => ({ tag: 'meta', attrs: { name, content } });
const socialMeta = (property, content) => ({ tag: 'meta', attrs: { property, content } });

export default defineConfig({
  plugins: [react(), {
    name: 'camp-seo',
    transformIndexHtml() {
      return [
        { tag: 'title', children: siteSeo.title },
        meta('description', siteSeo.description),
        { tag: 'link', attrs: { rel: 'canonical', href: siteSeo.url } },
        socialMeta('og:type', 'website'),
        socialMeta('og:locale', 'zh_TW'),
        socialMeta('og:site_name', 'SCAICT 2027 聯合寒訓'),
        socialMeta('og:url', siteSeo.url),
        socialMeta('og:title', siteSeo.title),
        socialMeta('og:description', siteSeo.description),
        socialMeta('og:image', siteSeo.image),
        socialMeta('og:image:alt', siteSeo.imageAlt),
        meta('twitter:card', 'summary_large_image'),
        meta('twitter:title', siteSeo.title),
        meta('twitter:description', siteSeo.description),
        meta('twitter:image', siteSeo.image),
        meta('twitter:image:alt', siteSeo.imageAlt),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(structuredData).replaceAll('<', '\\u003c'),
        },
      ];
    },
  }],
  build: {
    // 代碼分割優化
    rollupOptions: {
      output: {
        manualChunks: {
          // 將 React 分割成獨立的 chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // 啟用 CSS 代碼分割
    cssCodeSplit: true,
    // 最小化後的 chunk 大小
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  preview: {
    allowedHosts: true,
  },
  // 開發環境優化
  server: {
    middlewareMode: false,
  },
});
