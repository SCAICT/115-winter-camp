import { useLayoutEffect } from 'react';
import AboutPage from './components/AboutPage';
import TopicsPage from './components/TopicsPage';
import WinterLanding from './components/WinterLanding';
import { aboutSeo, topicsSeo } from './data/siteSeo';

const legacySections = {
  '報名': '#ticket',
  '關於': '#about',
  '主協辦': '#organizers',
  'FAQ': '#faq',
  '課表': '/topics/#schedule',
  '學員回饋': '#testimonials',
  '成果': '#photos',
  '照片': '#photos',
};

// 簡易路徑路由：預先輸出的靜態頁（首頁與子頁）。path 由預渲染傳入，瀏覽器則讀取目前網址。
export default function App({ path }) {
  useLayoutEffect(() => {
    const handleLegacyHash = () => {
      const { hash, pathname, search } = window.location;
      if (!hash.startsWith('#/')) return;

      let section = '';
      try {
        section = decodeURIComponent(hash.slice('#/home/'.length));
      } catch {
        // Malformed or obsolete hashes should still land on the new homepage.
      }

      const target = hash === '#/photos' ? '#photos'
        : hash.startsWith('#/home/') ? legacySections[section] ?? '#top' : '#top';
      // 已搬到子頁的區塊（例如課表）直接轉到子頁。
      if (target.startsWith('/')) {
        window.location.replace(target);
        return;
      }
      window.history.replaceState(null, '', `${pathname}${search}${target}`);
      const destination = document.querySelector(target);
      const top = target === '#top' ? 0 : destination?.getBoundingClientRect().top + window.scrollY;
      const previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, top ?? 0);
      document.documentElement.style.scrollBehavior = previousBehavior;
    };

    handleLegacyHash();
    window.addEventListener('hashchange', handleLegacyHash);
    return () => window.removeEventListener('hashchange', handleLegacyHash);
  }, []);

  const current = `${(path ?? window.location.pathname).replace(/\/+$/, '')}/`;
  if (current === topicsSeo.path) return <TopicsPage />;
  if (current === aboutSeo.path) return <AboutPage />;
  return <WinterLanding />;
}
