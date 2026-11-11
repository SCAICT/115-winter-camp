import { useEffect, useRef } from 'react';

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
});

export default function ScheduleEventDialog({ event, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    dialog.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (dialog.open) dialog.close();
    };
  }, []);

  const close = () => dialogRef.current?.close();
  const onBackdropClick = (click) => {
    if (click.target !== click.currentTarget) return;
    const bounds = click.currentTarget.getBoundingClientRect();
    if (click.clientX < bounds.left || click.clientX > bounds.right || click.clientY < bounds.top || click.clientY > bounds.bottom) close();
  };

  return (
    <dialog ref={dialogRef} className="schedule-event-dialog" aria-labelledby="schedule-event-title" aria-describedby="schedule-event-description" onClose={(closeEvent) => { if (!closeEvent.currentTarget.open) onClose(); }} onClick={onBackdropClick}>
      <header className="schedule-event-dialog__header">
        <div><p className="overline">DAY {String(event.dayNumber).padStart(2, '0')} · 活動詳情</p><h3 id="schedule-event-title">{event.title}</h3></div>
        <button className="schedule-event-dialog__close" type="button" autoFocus aria-label="關閉活動詳情" onClick={close}>×</button>
      </header>
      <div className="schedule-event-dialog__body">
        <dl className="schedule-event-dialog__meta">
          <div><dt>日期</dt><dd><time dateTime={event.date}>{dateFormatter.format(new Date(`${event.date}T12:00:00+08:00`))}</time></dd></div>
          <div><dt>時間（台灣時間）</dt><dd><time dateTime={`${event.date}T${event.start}:00+08:00`}>{event.start}</time>–<time dateTime={`${event.date}T${event.end}:00+08:00`}>{event.end}</time></dd></div>
          <div><dt>地點</dt><dd>{event.location ?? '待公布'}</dd></div>
          {event.speaker && <div><dt>講者</dt><dd>{event.speaker}</dd></div>}
        </dl>
        <section className="schedule-event-dialog__description" aria-labelledby="schedule-event-description-title"><h4 id="schedule-event-description-title">活動說明</h4><p id="schedule-event-description">{event.description ?? '詳細活動內容將另行公布。'}</p></section>
        {event.speakerBio && <section className="schedule-event-dialog__description"><h4>講者介紹</h4><p>{event.speakerBio}</p></section>}
        {event.link && <a className="guide-text-link" href={event.link} target="_blank" rel="noopener noreferrer">查看活動資料 <span aria-hidden="true">↗</span></a>}
      </div>
    </dialog>
  );
}
