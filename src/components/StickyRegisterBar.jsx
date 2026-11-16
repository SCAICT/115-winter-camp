import { useEffect, useState } from 'react';
import { winterCamp } from '../data/winterCamp';
import useRegistrationStatus, { registerLink } from '../hooks/useRegistrationStatus';

const SHOW_AFTER = 480;
const eventDates = (winterCamp.dates ?? '').split(' ~ ').map((date) => date.slice(5).replace('-', '/')).join('–');

// 手機／平板的底部報名列（導覽列的 CTA 在這些寬度被收進選單）。
// 捲過首屏後才出現，票價區自己有報名按鈕時則先隱藏；桌機寬度由 CSS 不顯示。
export default function StickyRegisterBar({ home = '' }) {
  const [scrolled, setScrolled] = useState(false);
  const [ticketInView, setTicketInView] = useState(false);
  const status = useRegistrationStatus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ticket = document.getElementById('ticket');
    if (!ticket) return undefined;
    const observer = new IntersectionObserver(([entry]) => setTicketInView(entry.isIntersecting));
    observer.observe(ticket);
    return () => observer.disconnect();
  }, []);

  const visible = scrolled && !ticketInView;
  const { price, daysText, currentPeriod } = status;

  return (
    <div className="register-bar" data-visible={visible} inert={!visible}>
      <p className="register-bar__text">
        <strong>{currentPeriod ? `${currentPeriod.name}價 $${price.toLocaleString('en-US')}` : '2027 聯合寒訓'}</strong>
        <span>{currentPeriod ? daysText : status.label || eventDates}</span>
      </p>
      <a className="register-bar__cta" {...registerLink(home)}>前往報名 <span aria-hidden="true">↗</span></a>
    </div>
  );
}
