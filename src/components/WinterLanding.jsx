import { winterCamp } from '../data/winterCamp';

const formatPrice = (value) => `$${value.toLocaleString('en-US')}`;

function Header() {
  return (
    <header className="site-header">
      <nav className="wrap site-header__inner" aria-label="主選單">
        <a href="#top" aria-label="SCAICT 2027 聯合寒訓，回到頂端">
          <img src="/img/LOGO/white_logo_nobg.webp" alt="SCAICT" width="125" height="35" />
        </a>
        <a href="#ticket">盲鳥票 <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <h1 id="hero-title">2027<br />聯合寒訓</h1>
      <p className="hero__description">主視覺與課程內容準備中。<br />盲鳥票價已公布，開賣消息待公布。</p>
      <a className="button" href="#ticket">查看盲鳥票 <span aria-hidden="true">↓</span></a>
    </section>
  );
}

function Ticket() {
  const { ticket, instagram } = winterCamp;
  const blindBird = ticket.plans.find((plan) => plan.name === '盲鳥');

  return (
    <section id="ticket" className="section ticket-section" aria-labelledby="ticket-title">
      <div className="wrap">
        <p className="overline">BLIND BIRD</p>
        <h2 id="ticket-title">盲鳥票</h2>
        <div className="ticket-prices">
          <div><span>住宿 · 每位學員</span><strong>{formatPrice(blindBird.withStay)}</strong></div>
          <div><span>不住宿 · 每位學員</span><strong>{formatPrice(blindBird.withoutStay)}</strong></div>
        </div>
        <p className="ticket-note">開賣時間：{ticket.salesStart ?? '待公布'}　／　名額：{ticket.quantity ?? '待公布'}{ticket.salesEnd && `　／　截止時間：${ticket.salesEnd}`}</p>
        {ticket.url ? (
          <a className="button" href={ticket.url} target="_blank" rel="noopener noreferrer">前往售票頁面 <span aria-hidden="true">↗</span></a>
        ) : (
          <a className="button" href={instagram} target="_blank" rel="noopener noreferrer">追蹤開賣消息 <span aria-hidden="true">↗</span></a>
        )}

        <div className="rates" aria-labelledby="rates-title">
          <h3 id="rates-title">完整票價</h3>
          <p>新臺幣／每位學員。各票種的開賣時間與適用方式待公布。</p>
          <table>
            <thead><tr><th scope="col">票種</th><th scope="col">住宿</th><th scope="col">不住宿</th></tr></thead>
            <tbody>
              {ticket.plans.map((plan) => (
                <tr key={plan.name} className={plan.name === '盲鳥' ? 'rates__highlight' : ''}>
                  <th scope="row">{plan.name}</th>
                  <td>{formatPrice(plan.withStay)}</td>
                  <td>{formatPrice(plan.withoutStay)}</td>
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <p>SCAICT 中部高中電資社團聯合會議</p>
        <div>
          <a href={winterCamp.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          <a href={`mailto:${winterCamp.email}`}>Email ↗</a>
        </div>
      </div>
    </footer>
  );
}

export default function WinterLanding() {
  return (
    <>
      <a className="skip-link" href="#ticket">跳到盲鳥票資訊</a>
      <Header />
      <main id="top"><Hero /><Ticket /><Details /></main>
      <Footer />
    </>
  );
}
