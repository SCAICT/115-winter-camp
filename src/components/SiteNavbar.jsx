import { useEffect, useRef, useState } from 'react';

const compactQuery = '(max-width: 1023px)';
const navigation = [
  { label: '關於 SCAICT', href: '#about' },
  { label: '活動資訊', href: '#details' },
  { label: '學員回饋', href: '#testimonials' },
  { label: '主協辦單位', href: '#organizers' },
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia(compactQuery).matches);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(compactQuery);
    const onChange = (event) => {
      setCompact(event.matches);
      setMenuOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onHashChange = () => setMenuOpen(false);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
    }}>
      <nav className="wrap site-header__inner" aria-label="主選單">
        <a className="site-header__brand" href="#top" aria-label="SCAICT 2027 聯合寒訓，回到頂端" onClick={() => setMenuOpen(false)}>
          <img src="/img/LOGO/white_logo_nobg.webp" alt="SCAICT" width="125" height="35" />
          <span className="site-header__event"><span>2027</span>聯合寒訓</span>
        </a>
        <button ref={toggleRef} className="site-header__toggle" type="button" aria-label={menuOpen ? '關閉選單' : '開啟選單'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="site-header__toggle-icon" aria-hidden="true"><span /><span /></span>
        </button>
        <div id="site-navigation" className={`site-header__menu${menuOpen ? ' is-open' : ''}`} inert={compact && !menuOpen}>
          <div className="site-header__menu-content">
            <ul className="site-header__links">
              {navigation.map(({ label, href }) => (
                <li key={href}><a href={href} onClick={() => setMenuOpen(false)}>{label}</a></li>
              ))}
            </ul>
            <a className="site-header__cta" href="#ticket" onClick={() => setMenuOpen(false)}>查看盲鳥票 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </nav>
    </header>
  );
}
