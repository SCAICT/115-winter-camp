import { useEffect, useRef, useState } from 'react';
import { winterCamp, organizations } from '../data/winterCamp';
import CampMemories from './CampMemories';
import SiteFooter from './SiteFooter';
import SiteNavbar from './SiteNavbar';
import CountUp from './CountUp';
import usePageMotion from '../hooks/usePageMotion';
import useTaipeiDate from '../hooks/useTaipeiDate';
import CampSchedule from './CampSchedule';
import CampStay from './CampStay';
import RegistrationFlow from './RegistrationFlow';
import CampFaq from './CampFaq';

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`;
const formatDate = (value) => value.replaceAll('-', '/');

function Hero() {
  const [startsOn, endsOn] = winterCamp.dates?.split(' ~ ') ?? [];
  const [visible, setVisible] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="hero" aria-labelledby="hero-title" data-ambient-paused={!visible}>
      <div className="hero__ambient" aria-hidden="true">
        <div className="hero__glow" />
        <div className="hero__orbit hero__orbit--outer"><span /></div>
        <div className="hero__orbit hero__orbit--inner"><span /></div>
        <div className="hero__cross hero__cross--one">+</div>
        <div className="hero__cross hero__cross--two">+</div>
      </div>
      <div className="hero__layout wrap">
        <div className="hero__content">
          <p className="hero__eyebrow">SCAICT 中部高中電資社團聯合會議</p>
          <h1 id="hero-title"><span className="hero__year">2027</span><span>聯合寒訓</span></h1>
          <span className="hero__divider" aria-hidden="true" />
          <p className="hero__description">這個冬天，寫下屬於我們的故事</p>
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
      </div>
    </section>
  );
}

function Ticket() {
  const { ticket, instagram } = winterCamp;
  const blindBird = ticket.plans.find((plan) => plan.name === '盲鳥');
  const regularPrice = ticket.plans.find((plan) => plan.name === '單人').price;
  const savings = regularPrice - blindBird.price;
  const today = useTaipeiDate();
  const currentPeriod = ticket.registrationPeriods.find((period) => period.startsOn <= today && today <= period.endsOn);
  const nextPeriod = ticket.registrationPeriods.find((period) => today < period.startsOn);
  const registrationSummary = currentPeriod
    ? `${currentPeriod.name}報名開放中，至 ${formatDate(currentPeriod.endsOn)} 截止。`
    : nextPeriod
      ? `${nextPeriod.name}報名將於 ${formatDate(nextPeriod.startsOn)} 開放。`
      : '本次報名已結束。';

  return (
    <section id="ticket" className="section ticket-section" aria-labelledby="ticket-title">
      <div className="wrap">
        <h2 id="ticket-title" data-reveal>盲鳥票</h2>
        <p className="ticket-tagline" data-reveal>早起的鳥兒有蟲吃，更早的鳥兒...</p>
        <div className="ticket-prices" data-reveal="scale">
          <div>
            <div className="ticket-price-main">
              <p className="ticket-price-meta">含{ticket.includes.join('、')} · 每位學員</p>
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
          <a className="button" href={ticket.url} target="_blank" rel="noopener noreferrer">前往報名表單 <span aria-hidden="true">↗</span></a>
        ) : (
          <a className="button" href={instagram} target="_blank" rel="noopener noreferrer">追蹤開賣消息 <span aria-hidden="true">↗</span></a>
        )}

        <div className="rates registration-schedule" aria-labelledby="registration-title" data-reveal>
          <h3 id="registration-title">報名時程</h3>
          <p role="status">{registrationSummary}</p>
          <table>
            <caption>時程以台灣時間（UTC+8）為準，截止日當天 23:59 結束。</caption>
            <thead><tr><th scope="col">報名階段</th><th scope="col">報名期間</th></tr></thead>
            <tbody>
              {ticket.registrationPeriods.map((period) => {
                const isCurrent = period === currentPeriod;
                const status = isCurrent ? 'current' : period.endsOn < today ? 'ended' : 'upcoming';
                return (
                  <tr key={period.name} className={isCurrent ? 'rates__highlight' : undefined} aria-current={isCurrent ? 'step' : undefined} data-registration-status={status}>
                    <th scope="row">
                      <span className="registration-schedule__phase">
                        <span>{period.name}報名</span>
                        <span className="registration-schedule__badge">{isCurrent ? '目前開放' : status === 'ended' ? '已結束' : '尚未開始'}</span>
                      </span>
                    </th>
                    <td><time dateTime={period.startsOn}>{formatDate(period.startsOn)}</time> ～ <time dateTime={period.endsOn}>{formatDate(period.endsOn)}</time></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <RegistrationFlow />
      </div>
    </section>
  );
}

function Details() {
  const venueQuery = encodeURIComponent(winterCamp.venue);

  return (
    <section id="details" className="section details-section" aria-labelledby="details-title">
      <div className="wrap">
        <div className="details-layout">
          <div className="details-intro">
            <h2 id="details-title" data-reveal>活動資訊</h2>
            <dl className="details-list">
              <div data-reveal style={{ '--reveal-delay': '80ms' }}><dt>地點</dt><dd>{winterCamp.venue}</dd></div>
              <div data-reveal style={{ '--reveal-delay': '160ms' }}><dt>日期</dt><dd>{winterCamp.dates ?? '待公布'}</dd></div>
              <div data-reveal style={{ '--reveal-delay': '240ms' }}><dt>住宿</dt><dd><a className="details-list__link" href="#stay">{winterCamp.accommodation.name} <span aria-hidden="true">↗</span></a></dd></div>
            </dl>
          </div>
          <div className="venue-map" data-reveal="scale">
            <div className="venue-map__frame">
              <iframe src={`https://www.google.com/maps?q=${venueQuery}&hl=zh-TW&z=15&output=embed`} title={`${winterCamp.venue}位置地圖`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
        <CampStay />
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about__layout">
          <div className="about__intro" data-reveal>

            <h2 id="about-title">關於 SCAICT</h2>
            <p className="about__name" lang="en">Student Club&apos;s Association of Information in Central Taiwan</p>
          </div>
          <div className="about__content">
            <h3 className="about__lead" data-reveal>結合中部電資資源，<br />讓資訊教育持續傳承。</h3>
            <p className="about__description" data-reveal>中部高中電資社團聯合會議（SCAICT），簡稱「中電會」。2021 年 12 月 7 日，在 AIS3 新型態資安實務主題課程中，臺灣科技大學資訊工程系鄭欣明教授與陽明交通大學資訊工程系黃俊穎教授，提出將中部所有資訊社團聯合起來，成為一個「大組織」的構想，發起「中部高中職電資聯合會議」。</p>
            <p className="about__description" data-reveal>以結合中區電資資源為起點，積極辦理資訊教育、活動與比賽，讓各校社團彼此交流、共同成長，並將經驗與資源持續傳承下去。</p>
          </div>
        </div>
        <dl className="about__stats">
          <div data-reveal><dt>深耕中部教育</dt><dd><CountUp value={5} /><span>+</span></dd></div>
          <div data-reveal style={{ '--reveal-delay': '100ms' }}><dt>聯合參與社團</dt><dd><CountUp value={23} /><span>+</span></dd></div>
          <div data-reveal style={{ '--reveal-delay': '200ms' }}><dt>熱愛資訊的夥伴</dt><dd><CountUp value={200} /><span>+</span></dd></div>
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
        <h2 id="organizers-title" data-reveal>主辦與協辦</h2>
        {organizations.map(({ label, members }) => (
          <div className="organizer-group" key={label}>
            <h3 className="organizer-group__heading" data-reveal><span>{label}</span></h3>
            <ul>
              {members.map((member, index) => (
                <li key={member.shortName} data-reveal style={{ '--reveal-delay': `${(index % 3) * 90}ms` }}>
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
  const pageRef = useRef(null);
  const progressRef = useRef(null);
  usePageMotion(pageRef, progressRef);

  return (
    <div id="top" ref={pageRef}>
      <a className="skip-link" href="#ticket">跳到盲鳥票資訊</a>
      <SiteNavbar progressRef={progressRef} />
      <main><Hero /><About /><Details /><CampSchedule /><Ticket /><CampMemories /><CampFaq /><Organizers /></main>
      <SiteFooter />
    </div>
  );
}
