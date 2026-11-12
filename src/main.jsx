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

// 帶著錨點進入頁面時，要在顯示頁面之前直接定位到該區塊，避免先看到頂端再滑動；
// 重新整理與上一頁／下一頁交給瀏覽器還原原本的捲動位置。
// 正式版這件事由 index.html 的內嵌腳本在字型就緒、顯示頁面前處理（預先渲染的 HTML 已有該區塊）；
// 開發模式沒有預先渲染的 HTML，等 React 渲染完再定位。
function restoreHashPosition() {
  const { hash } = window.location;
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  if (hash.length < 2 || hash.startsWith('#/') || (navigationType && navigationType !== 'navigate')) return;
  try {
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' });
  } catch {
    // 無效的錨點不處理。
  }
}

if (import.meta.env.DEV) requestAnimationFrame(restoreHashPosition);
