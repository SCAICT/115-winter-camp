import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

async function revealAfterFontsLoad() {
  if (document.fonts?.load) {
    let timeoutId;

    try {
      const sample = '2027 聯合寒訓盲鳥票活動資訊';
      await Promise.race([
        Promise.all([
          document.fonts.load('400 16px "LINE Seed TW"', sample),
          document.fonts.load('700 16px "LINE Seed TW"', sample),
        ]),
        new Promise((resolve) => {
          timeoutId = window.setTimeout(resolve, 15000);
        }),
      ]);
    } catch {
      // Still show the site with the system fallback if a font cannot load.
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  document.documentElement.classList.add('fonts-ready');
  document.getElementById('font-loading')?.remove();
}

revealAfterFontsLoad();
