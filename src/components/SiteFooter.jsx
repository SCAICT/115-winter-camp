import { winterCamp } from '../data/winterCamp';

const navigation = [
  {
    title: '參與寒訓',
    links: [
      ...(winterCamp.ticket.url ? [{ label: '報名表單', href: winterCamp.ticket.url }] : []),
      { label: '票價與時程', href: '#ticket' },
      { label: '報名流程', href: '#registration' },
      { label: '常見問題', href: '#faq' },
    ],
  },
  {
    title: '活動指南',
    links: [
      { label: '活動資訊', href: '#details' },
      { label: '四天課表', href: '/topics/#schedule' },
      { label: '住宿與生活', href: '#stay' },
      { label: '營隊相簿', href: '#photos' },
    ],
  },
  {
    title: '認識我們',
    links: [
      { label: '關於我們', href: '#about' },
      { label: '學員回饋', href: '#testimonials' },
      { label: '主辦與協辦', href: '#organizers' },
      { label: 'SCAICT 官網', href: 'https://scaict.org/' },
    ],
  },
];

export default function SiteFooter({ home = '' }) {
  return (
    <footer className="site-footer" aria-label="網站頁尾">
      <div className="wrap">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a href="https://scaict.org/" target="_blank" rel="noopener noreferrer" aria-label="SCAICT 官方網站（另開視窗）">
              <img src="/img/LOGO/white_logo_nobg.webp" alt="SCAICT" width="125" height="35" loading="lazy" />
            </a>
            <p>中部高中電資社團聯合會議</p>
            <span>由學生串連的資訊社群</span>
            <address className="site-footer__contact" aria-label="聯絡我們">
              <a href={winterCamp.instagram} target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a>
              <a href={`mailto:${winterCamp.email}`}>{winterCamp.email}</a>
            </address>
          </div>

          <nav className="site-footer__navigation" aria-label="頁尾導覽">
            {navigation.map(({ title, links }) => (
              <div className="site-footer__group" key={title}>
                <h3>{title}</h3>
                <ul>
                  {links.map(({ label, href }) => {
                    const external = href.startsWith('https://');
                    const target = external || href.startsWith('/') ? href : `${home}${href}`;
                    return (
                      <li key={href}>
                        <a href={target} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
                          {label}{external && <span aria-hidden="true"> ↗</span>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p><span>© 2027 SCAICT</span><span>中部高中電資社團聯合會議</span></p>
          <a className="site-footer__back-top" href="#top">回到頂端 <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
