import { useEffect, useRef, useState } from 'react';
import { winterCamp, organizations } from '../data/winterCamp';

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

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
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={headerRef}>
      <nav className="wrap site-header__inner" aria-label="主選單">
        <a className="site-header__brand" href="#top" aria-label="SCAICT 2027 聯合寒訓，回到頂端" onClick={() => setMenuOpen(false)}>
          <img src="/img/LOGO/white_logo_nobg.webp" alt="SCAICT" width="125" height="35" />
        </a>
        <button ref={toggleRef} className={`site-header__toggle${menuOpen ? ' is-open' : ''}`} type="button" aria-label={menuOpen ? '關閉選單' : '開啟選單'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
        <div id="site-navigation" className={`site-header__links${menuOpen ? ' site-header__links--open' : ''}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>關於 SCAICT</a>
          <a href="#details" onClick={() => setMenuOpen(false)}>活動資訊</a>
          <a href="#organizers" onClick={() => setMenuOpen(false)}>主辦與協辦</a>
          <a className="site-header__cta" href="#ticket" onClick={() => setMenuOpen(false)}>盲鳥票</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const [startsOn, endsOn] = winterCamp.dates?.split(' ~ ') ?? [];

  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">SCAICT 中部高中電資社團聯合會議</p>
        <h1 id="hero-title"><span className="hero__year">2027</span><span>聯合寒訓</span></h1>
        <span className="hero__divider" aria-hidden="true" />
        <p className="hero__description">主視覺與課程內容準備中。<br />盲鳥票價已公布，開賣消息待公布。</p>
        <a className="button" href="#ticket">查看盲鳥票 <span aria-hidden="true">↗</span></a>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual-top">
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 2v60M2 32h60M11 11l42 42M53 11 11 53" stroke="currentColor" strokeWidth="1.5" /></svg>
        </div>
        <div className="hero__visual-type">
          <span className="hero__visual-outline">27</span>
          <span className="hero__visual-wordmark">WINTER<br /><span>CAMP.</span></span>
        </div>
        <div className="hero__visual-bottom">
        </div>
      </div>
    </section>
  );
}

function Ticket() {
  const { ticket, instagram } = winterCamp;
  const blindBird = ticket.plans.find((plan) => plan.name === '盲鳥');

  return (
    <section id="ticket" className="section ticket-section" aria-labelledby="ticket-title">
      <div className="wrap">
        <h2 id="ticket-title">盲鳥票</h2>
        <div className="ticket-prices">
          <div><span>含住宿 · 每位學員</span><strong>{formatPrice(blindBird.price)}</strong></div>
        </div>
        <p className="ticket-note">開賣時間：{ticket.salesStart ?? '待公布'}　／　名額：{ticket.quantity ?? '待公布'}{ticket.salesEnd && `　／　截止時間：${ticket.salesEnd}`}</p>
        {ticket.url ? (
          <a className="button" href={ticket.url} target="_blank" rel="noopener noreferrer">前往售票頁面 <span aria-hidden="true">↗</span></a>
        ) : (
          <a className="button" href={instagram} target="_blank" rel="noopener noreferrer">追蹤開賣消息 <span aria-hidden="true">↗</span></a>
        )}

        <div className="rates" aria-labelledby="rates-title">
          <h3 id="rates-title">完整票價</h3>
          <p>新臺幣／每位學員，所有票種皆含住宿。各票種的開賣時間與適用方式待公布。</p>
          <table>
            <thead><tr><th scope="col">票種</th><th scope="col">票價（含住宿）</th></tr></thead>
            <tbody>
              {ticket.plans.map((plan) => (
                <tr key={plan.name} className={plan.name === '盲鳥' ? 'rates__highlight' : ''}>
                  <th scope="row">{plan.name}</th>
                  <td>{formatPrice(plan.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Details() {
  return (
    <section id="details" className="section details-section" aria-labelledby="details-title">
      <div className="wrap">
        <h2 id="details-title">活動資訊</h2>
        <dl className="details-list">
          <div><dt>名稱</dt><dd>{winterCamp.name}</dd></div>
          <div><dt>地點</dt><dd>{winterCamp.venue}</dd></div>
          <div><dt>日期</dt><dd>{winterCamp.dates ?? '待公布'}</dd></div>
          <div><dt>課程</dt><dd>規劃中</dd></div>
        </dl>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="wrap">

        <h2 id="about-title">關於 SCAICT</h2>
        <p>SCAICT 中部高中電資社團聯合會議，是由學生自主營運的資訊社群。自 2021 年發起、2022 年正式成立以來，我們致力於串連中部的電資社團，整合學習資源，讓不同學校的夥伴能夠交流與合作。</p>
        <p>我們關注資訊教育的扎根，透過課程、實作和開源精神，讓對技術有熱忱的學子找到學習的起點。除了跨校交流，也與北部、南部的學生社群協辦大型營隊，打破地域限制，讓更多人一起學習、分享與成長。</p>
        <a href="https://scaict.org/" target="_blank" rel="noopener noreferrer">認識 SCAICT ↗</a>
      </div>
    </section>
  );
}

function Organizers() {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!selected) return undefined;
    const dialog = dialogRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [selected]);

  const openModal = (member, label, trigger) => {
    triggerRef.current = trigger;
    setSelected({ ...member, label });
  };

  const closeModal = () => dialogRef.current?.close();

  return (
    <section id="organizers" className="section organizers-section" aria-labelledby="organizers-title">
      <div className="wrap">
        <h2 id="organizers-title">主辦與協辦</h2>
        {organizations.map(({ label, members }) => (
          <div className={`organizer-group${members.length === 1 ? ' organizer-group--single' : ''}`} key={label}>
            <h3 className="organizer-group__heading"><span>{label}</span></h3>
            <ul>
              {members.map((member, index) => (
                <li key={member.shortName}>
                  <button type="button" className={`organizer-card organizer-card--${members.length === 1 ? 'single' : index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : 'middle'}`} onClick={(event) => openModal(member, label, event.currentTarget)} aria-haspopup="dialog" aria-label={`查看${label} ${member.name}詳細資訊`}>
                    <span className="organizer-card__logo"><img src={member.logo} alt="" loading="lazy" /></span>
                    <strong>{member.name}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selected && (
        <dialog ref={dialogRef} className="organizer-modal" aria-labelledby="organizer-modal-title" aria-describedby="organizer-modal-description" onClose={() => { setSelected(null); triggerRef.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <div className="organizer-modal__content">
            <button type="button" className="organizer-modal__close" aria-label="關閉單位介紹" onClick={closeModal}>×</button>
            <div className="organizer-modal__logo"><img src={selected.logo} alt="" /></div>
            <p className="organizer-modal__label">{selected.label} · {selected.shortName}</p>
            <h3 id="organizer-modal-title">{selected.name}</h3>
            <p id="organizer-modal-description" className="organizer-modal__details">{selected.desc}</p>
            <a className="organizer-modal__link" href={selected.href} target="_blank" rel="noopener noreferrer">前往官方網站 <span aria-hidden="true">↗</span></a>
          </div>
        </dialog>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <div className="site-footer__columns">
          <div><h2>2027 聯合寒訓</h2><a href="#ticket">盲鳥票</a><a href="#details">活動資訊</a></div>
          <div><h2>關於我們</h2><a href="#about">關於 SCAICT</a><a href="#organizers">主辦與協辦</a></div>
          <div><h2>聯絡我們</h2><a href={winterCamp.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={`mailto:${winterCamp.email}`}>{winterCamp.email} ↗</a></div>
        </div>
        <div className="site-footer__bottom"><strong>SCAICT</strong><p>© 2027 SCAICT 中部高中電資社團聯合會議</p><a href="#top">回到頂端 ↑</a></div>
      </div>
    </footer>
  );
}

export default function WinterLanding() {
  return (
    <>
      <a className="skip-link" href="#ticket">跳到盲鳥票資訊</a>
      <Header />
      <main id="top"><Hero /><About /><Ticket /><Details /><Organizers /></main>
      <Footer />
    </>
  );
}
