import { useEffect, useRef, useState } from 'react';
import { winterCamp, organizations } from '../data/winterCamp';
import CampMemories from './CampMemories';
import SiteFooter from './SiteFooter';
import SiteNavbar from './SiteNavbar';

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`;
const formatDate = (value) => value.replaceAll('-', '/');

function Hero() {
  const [startsOn, endsOn] = winterCamp.dates?.split(' ~ ') ?? [];

  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">SCAICT 中部高中電資社團聯合會議</p>
        <h1 id="hero-title"><span className="hero__year">2027</span><span>聯合寒訓</span></h1>
        <span className="hero__divider" aria-hidden="true" />
        <p className="hero__description">主視覺與課程內容準備中</p>
        <a className="button" href="#ticket">查看盲鳥票 <span aria-hidden="true">↗</span></a>
      </div>
      {startsOn && endsOn && (
        <div className="hero__dates" role="group" aria-label="活動日期">
          <time dateTime={startsOn} aria-label={formatDate(startsOn)}>
            <span className="hero__date-month">{Number(startsOn.split('-')[1])}</span><span className="hero__date-day">.{Number(startsOn.split('-')[2])}</span>
          </time>
          <span className="hero__date-separator" aria-hidden="true">−</span>
          <time dateTime={endsOn} aria-label={formatDate(endsOn)}>
            <span className="hero__date-month">{Number(endsOn.split('-')[1])}</span><span className="hero__date-day">.{Number(endsOn.split('-')[2])}</span>
          </time>
        </div>
      )}
    </section>
  );
}

function Ticket() {
  const { ticket, instagram } = winterCamp;
  const blindBird = ticket.plans.find((plan) => plan.name === '盲鳥');
  const regularPrice = ticket.plans.find((plan) => plan.name === '單人').price;
  const savings = regularPrice - blindBird.price;
  const blindBirdRegistration = ticket.registrationPeriods.find((period) => period.name === '盲鳥');

  return (
    <section id="ticket" className="section ticket-section" aria-labelledby="ticket-title">
      <div className="wrap">
        <h2 id="ticket-title">盲鳥票</h2>
        <div className="ticket-prices">
          <div>
            <div className="ticket-price-main">
              <p className="ticket-price-meta">含住宿、餐食、場地、保險 · 每位學員</p>
              <p className="ticket-original-price">原價 <del>{formatPrice(regularPrice)}</del></p>
              <div className="ticket-price-row">
                <span className="ticket-price-label">盲鳥價</span>
                <strong className="ticket-current-price" aria-label={`盲鳥價 ${blindBird.price} 元`}>{formatPrice(blindBird.price)}</strong>
              </div>
            </div>
            <div className="ticket-discount" aria-label={`現省 ${savings} 元`}>
              <span className="ticket-discount__label">盲鳥直接折</span>
              <p className="ticket-discount__amount"><span aria-hidden="true"></span><strong>{savings.toLocaleString('zh-TW')}</strong><span>元</span></p>
            </div>
          </div>
        </div>
        <p className="ticket-note"></p>
        {ticket.url ? (
          <a className="button" href={ticket.url} target="_blank" rel="noopener noreferrer">前往售票頁面 <span aria-hidden="true">↗</span></a>
        ) : (
          <a className="button" href={instagram} target="_blank" rel="noopener noreferrer">追蹤開賣消息 <span aria-hidden="true">↗</span></a>
        )}

        <div className="rates registration-schedule" aria-labelledby="registration-title">
          <h3 id="registration-title">報名時程</h3>
          <table>
            <thead><tr><th scope="col">報名階段</th><th scope="col">報名期間</th></tr></thead>
            <tbody>
              {ticket.registrationPeriods.map((period) => (
                <tr key={period.name}>
                  <th scope="row">{period.name}報名</th>
                  <td><time dateTime={period.startsOn}>{formatDate(period.startsOn)}</time> ～ <time dateTime={period.endsOn}>{formatDate(period.endsOn)}</time></td>
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
  const venueQuery = encodeURIComponent(winterCamp.venue);

  return (
    <section id="details" className="section details-section" aria-labelledby="details-title">
      <div className="wrap">
        <h2 id="details-title">活動資訊</h2>
        <div className="details-layout">
          <dl className="details-list">
            <div><dt>名稱</dt><dd>{winterCamp.name}</dd></div>
            <div><dt>地點</dt><dd>{winterCamp.venue}</dd></div>
            <div><dt>日期</dt><dd>{winterCamp.dates ?? '待公布'}</dd></div>
            <div><dt>住宿</dt><dd>旅巷自在輕旅 Loosha Hostel</dd></div>
          </dl>
          <div className="venue-map">
            <div className="venue-map__frame">
              <iframe src={`https://www.google.com/maps?q=${venueQuery}&hl=zh-TW&z=15&output=embed`} title={`${winterCamp.venue}位置地圖`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about__layout">
          <div className="about__intro">

            <h2 id="about-title">關於 SCAICT</h2>
            <p className="about__name" lang="en">Student Club&apos;s Association of Information in Central Taiwan</p>
          </div>
          <div className="about__content">
            <h3 className="about__lead">結合中部電資資源，<br />讓資訊教育持續傳承。</h3>
            <p className="about__description">中部高中電資社團聯合會議（SCAICT），簡稱「中電會」。2021 年 12 月 7 日，在 AIS3 新型態資安實務主題課程中，臺灣科技大學資訊工程系鄭欣明教授與陽明交通大學資訊工程系黃俊穎教授，提出將中部所有資訊社團聯合起來，成為一個「大組織」的構想，發起「中部高中職電資聯合會議」。</p>
            <p className="about__description">以結合中區電資資源為起點，積極辦理資訊教育、活動與比賽，讓各校社團彼此交流、共同成長，並將經驗與資源持續傳承下去。</p>
          </div>
        </div>
        <dl className="about__stats">
          <div><dt>深耕中部教育</dt><dd>5<span>+</span></dd></div>
          <div><dt>聯合參與社團</dt><dd>23<span>+</span></dd></div>
          <div><dt>熱愛資訊的夥伴</dt><dd>200<span>+</span></dd></div>
        </dl>
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
          <div className="organizer-group" key={label}>
            <h3 className="organizer-group__heading"><span>{label}</span></h3>
            <ul>
              {members.map((member) => (
                <li key={member.shortName}>
                  <button type="button" className="organizer-card" onClick={(event) => openModal(member, label, event.currentTarget)} aria-haspopup="dialog" aria-label={`查看${label} ${member.name}詳細資訊`}>
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

export default function WinterLanding() {
  return (
    <div id="top">
      <a className="skip-link" href="#ticket">跳到盲鳥票資訊</a>
      <SiteNavbar />
      <main><Hero /><About /><Details /><Ticket /><CampMemories /><Organizers /></main>
      <SiteFooter />
    </div>
  );
}
