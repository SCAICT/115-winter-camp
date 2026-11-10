import { useLayoutEffect } from 'react';
import WinterLanding from './components/WinterLanding';

const legacySections = {
  '報名': '#ticket',
  '關於': '#about',
  '主協辦': '#organizers',
  'FAQ': '#details',
  '學員回饋': '#testimonials',
  '成果': '#photos',
  '照片': '#photos',
};

export default function App() {
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

  return <WinterLanding />;
}
