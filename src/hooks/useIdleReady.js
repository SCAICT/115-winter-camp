import { useEffect, useState } from 'react';

// 頁面載入完成、瀏覽器也閒下來之後才回傳 true。
// 用來延後「不在首屏」的大量資源（例如照片牆的圖片），讓字型與腳本先拿到頻寬；
// 即使圖片標了 loading="lazy"，Chrome 對橫向捲動容器的判斷很寬，仍會在一開始就一次抓一大批。
export default function useIdleReady(timeout = 3000) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle;
    const run = () => { if (!cancelled) setReady(true); };
    const start = () => {
      handle = 'requestIdleCallback' in window ? window.requestIdleCallback(run, { timeout }) : window.setTimeout(run, 200);
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [timeout]);

  return ready;
}
