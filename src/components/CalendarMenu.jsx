import { useEffect, useId, useRef, useState } from 'react';

// 「加入行事曆」：點一下展開 Google Calendar、Apple Calendar、iCal 三個選項。
// 沒展開時選項仍在 HTML 裡（以透明、不可操作的方式隱藏），展開與收起都有淡入淡出的動畫。
export default function CalendarMenu({ links }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => { if (!rootRef.current.contains(event.target)) setOpen(false); };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="calendar-menu" ref={rootRef}>
      <button ref={buttonRef} className="calendar-menu__button" type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((current) => !current)}>
        加入行事曆 <span aria-hidden="true">▾</span>
      </button>
      <ul className="calendar-menu__list" id={menuId} data-open={open} inert={!open}>
        {links.map(({ label, href, download }) => (
          <li key={label}>
            {download
              ? <a href={href} download onClick={() => setOpen(false)}><strong>{label}</strong><span aria-hidden="true">↓</span></a>
              : <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><strong>{label}</strong><span aria-hidden="true">↗</span></a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
