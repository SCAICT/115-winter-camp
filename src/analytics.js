import { winterCamp } from './data/winterCamp';

// Google Analytics 4：只在正式版、且有填測量 ID 時載入；等頁面載完、瀏覽器閒下來才下載腳本，不影響首屏。
// 預先渲染的 HTML 不含任何追蹤程式碼，所以搜尋引擎抓到的內容不受影響。
export default function initAnalytics() {
  const { ga4 } = winterCamp.analytics;
  if (!import.meta.env.PROD || !ga4 || navigator.doNotTrack === '1') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // 不啟用 Google 信號與廣告個人化：營隊對象多為未成年的高中生，只做流量統計。
  window.gtag('config', ga4, { allow_google_signals: false, allow_ad_personalization_signals: false });

  const load = () => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.append(script);
  };
  const start = () => ('requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 4000 }) : window.setTimeout(load, 500));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  // 「前往報名表單」是這個網站最重要的轉換：記錄從哪個區塊點的。
  const ticketUrl = winterCamp.ticket.url;
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!ticketUrl || link?.href !== ticketUrl) return;
    const location = link.closest('header') ? 'navbar' : link.closest('section[id]')?.id ?? 'other';
    window.gtag('event', 'registration_click', { link_location: location, transport_type: 'beacon' });
  });
}
