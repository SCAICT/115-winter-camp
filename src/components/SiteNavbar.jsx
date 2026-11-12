import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const compactQuery = '(max-width: 1199px)';
// 沿用 115-summer-camp 的導覽方式：項目都是首頁區塊的捲動連結，並依捲動位置高亮目前區塊。
// 完整內容（/about/、/topics/）由各區塊內的按鈕進入。
const navigation = [
  { label: '關於我們', href: '#about' },
  { label: '課程主題', href: '#topics' },
];
const sectionIds = navigation.map(({ href }) => href.slice(1));

// home 為子頁使用：錨點連結需帶回首頁路徑（例如 "/#about"）。
export default function SiteNavbar({ progressRef, home = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [logoPulse, setLogoPulse] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const progressPathRef = useRef(null);
  const toggleRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const updateBorder = () => {
      const { width, height } = nav.getBoundingClientRect();
      const radius = (height - 2) / 2;
      const middle = height / 2;
      const right = width - middle;
      const cornerOffset = radius / Math.SQRT2;
      const start = middle - cornerOffset;

      // Start on the upper-left rounded corner, then follow the pill clockwise.
      progressRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
      progressPathRef.current.setAttribute('d', [
        `M ${start} ${start}`,
        `A ${radius} ${radius} 0 0 1 ${middle} 1`,
        `H ${right}`,
        `A ${radius} ${radius} 0 0 1 ${width - 1} ${middle}`,
        `A ${radius} ${radius} 0 0 1 ${right} ${height - 1}`,
        `H ${middle}`,
        `A ${radius} ${radius} 0 0 1 1 ${middle}`,
        `A ${radius} ${radius} 0 0 1 ${start} ${start}`,
        'Z',
      ].join(' '));
    };

    updateBorder();
    const observer = new ResizeObserver(updateBorder);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [progressRef]);

  useEffect(() => {
    const media = window.matchMedia(compactQuery);
    setCompact(media.matches);
    const onChange = (event) => {
      setCompact(event.matches);
      setMenuOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Scroll-spy：只在首頁（home 為空）追蹤目前所在的區塊，子頁不高亮。
  useEffect(() => {
    if (home) return undefined;
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          break;
        }
      }
    }, { threshold: 0, rootMargin: '-80px 0px -60% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [home]);

  useEffect(() => {
    if (!logoPulse) return undefined;
    const timer = window.setTimeout(() => setLogoPulse(false), 420);
    return () => window.clearTimeout(timer);
  }, [logoPulse]);

  const onLogoClick = (event) => {
    setMenuOpen(false);
    setLogoPulse(true);
    // 在首頁平滑捲回頂端；在子頁則照一般連結回首頁。
    if (!home) {
      event.preventDefault();
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      <nav ref={navRef} className="wrap site-header__inner" aria-label="主選單">
        <svg ref={progressRef} className="site-header__progress" aria-hidden="true" focusable="false">
          <path ref={progressPathRef} pathLength="1" />
        </svg>
        <a className={`site-header__brand${logoPulse ? ' is-pulse' : ''}`} href={home || '#top'} aria-label="SCAICT 2027 聯合寒訓，回到頂端" onClick={onLogoClick}>
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
                <li key={href}><a href={`${home}${href}`} aria-current={activeSection === href.slice(1) ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a></li>
              ))}
            </ul>
            <a className="site-header__cta" href={`${home}#ticket`} onClick={() => setMenuOpen(false)}>查看盲鳥票 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </nav>
    </header>
  );
}
