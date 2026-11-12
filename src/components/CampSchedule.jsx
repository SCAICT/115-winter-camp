import { useRef, useState } from 'react';
import { campSchedule } from '../data/campGuide';
import ScheduleEventDialog from './ScheduleEventDialog';

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const weekday = new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', weekday: 'short' });
const dateLabel = (date) => `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`;

function ScheduleEvent({ event, day, dayIndex, onOpen, mobile = false }) {
  const hasDetails = Boolean(event.description || event.speaker || event.speakerBio || event.link);
  const className = `camp-schedule__event-content${mobile ? ' camp-schedule__mobile-button' : ''}`;
  const content = (
    <>
      <span className="camp-schedule__event-time"><time>{event.start}</time>–<time>{event.end}</time></span>
      <strong>{event.title}</strong>
      {hasDetails && <span className="camp-schedule__event-info" aria-hidden="true">↗</span>}
    </>
  );

  if (!hasDetails) return <div className={className}>{content}</div>;

  return (
    <button className={`${className} camp-schedule__event-button`} type="button" data-event-key={`${day.date}-${event.start}`} aria-haspopup="dialog" aria-label={`查看第 ${dayIndex + 1} 天 ${event.start} 至 ${event.end} ${event.title}詳情`} onClick={(click) => onOpen(event, day, dayIndex, click.currentTarget)}>
      {content}
    </button>
  );
}

export default function CampSchedule() {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const tabRefs = useRef([]);
  const triggerRef = useRef(null);
  const { days, startTime, endTime } = campSchedule;
  const firstMinute = toMinutes(startTime);
  const minutes = toMinutes(endTime) - firstMinute;
  const active = days[activeDay];
  const timeSlots = Array.from({ length: Math.ceil(minutes / 30) }, (_, index) => {
    const minute = firstMinute + index * 30;
    return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
  });

  const openEvent = (event, day, index, trigger) => {
    triggerRef.current = trigger;
    setActiveDay(index);
    setSelectedEvent({ ...event, date: day.date, dayNumber: index + 1 });
  };

  const closeEvent = () => {
    const key = `${selectedEvent.date}-${selectedEvent.start}`;
    const trigger = triggerRef.current?.getClientRects().length ? triggerRef.current
      : [...document.querySelectorAll('.camp-schedule__event-button')].find((button) => button.dataset.eventKey === key && button.getClientRects().length);
    setSelectedEvent(null);
    trigger?.focus({ preventScroll: true });
  };

  const onTabKeyDown = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % days.length;
    if (event.key === 'ArrowLeft') next = (index + days.length - 1) % days.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = days.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveDay(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="schedule" className="camp-schedule guide-subsection" aria-labelledby="schedule-title">
      <div className="guide-heading" data-reveal>
        <div><h3 id="schedule-title">四天課表</h3></div>
      </div>
        <ul className="camp-schedule__legend" aria-label="活動分類" data-reveal>
          <li data-kind="learning">課程與講座</li><li data-kind="activity">活動與交流</li><li data-kind="meal">用餐</li><li data-kind="project">攻防競賽與成果</li><li data-kind="logistics">交通與生活</li>
        </ul>

        <div className="camp-schedule__desktop" data-reveal style={{ '--schedule-minutes': minutes }}>
          <div className="camp-schedule__time-column" aria-hidden="true">
            <div className="camp-schedule__time-heading">TIME</div>
            <div className="camp-schedule__hours">{timeSlots.map((slot) => <span key={slot}>{slot}</span>)}</div>
          </div>
          {days.map((day, index) => (
            <article className="camp-schedule__day" key={day.date} aria-labelledby={`schedule-desktop-day-${index}`}>
              <header className="camp-schedule__day-heading">
                <p>DAY <strong>{String(index + 1).padStart(2, '0')}</strong></p>
                <time dateTime={day.date}>{dateLabel(day.date)} <span>{weekday.format(new Date(`${day.date}T12:00:00+08:00`))}</span></time>
                <h3 id={`schedule-desktop-day-${index}`}>{day.title}</h3>
              </header>
              <ol className="camp-schedule__events">
                {day.events.map((event) => (
                  <li className={`camp-schedule__event${toMinutes(event.end) - toMinutes(event.start) <= 30 ? ' camp-schedule__event--compact' : ''}`} data-kind={event.kind} key={event.start} style={{ '--event-start': toMinutes(event.start) - firstMinute, '--event-duration': toMinutes(event.end) - toMinutes(event.start) }}>
                    <ScheduleEvent event={event} day={day} dayIndex={index} onOpen={openEvent} />
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div className="camp-schedule__mobile">
          <div className="camp-schedule__tabs" role="tablist" aria-label="選擇活動日期">
            {days.map((day, index) => (
              <button ref={(element) => { tabRefs.current[index] = element; }} key={day.date} id={`schedule-tab-${index}`} type="button" role="tab" aria-selected={index === activeDay} aria-controls="schedule-day-panel" tabIndex={index === activeDay ? 0 : -1} onClick={() => setActiveDay(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
                <span>DAY {String(index + 1).padStart(2, '0')}</span><time dateTime={day.date}>{dateLabel(day.date)}</time>
              </button>
            ))}
          </div>
          <div id="schedule-day-panel" className="camp-schedule__panel" role="tabpanel" aria-labelledby={`schedule-tab-${activeDay}`} tabIndex={0}>
            <header><p>{weekday.format(new Date(`${active.date}T12:00:00+08:00`))}</p><h3>{active.title}</h3></header>
            <ol className="camp-schedule__mobile-events">
              {active.events.map((event) => <li className="camp-schedule__mobile-event" data-kind={event.kind} key={`${active.date}-${event.start}`}><ScheduleEvent event={event} day={active} dayIndex={activeDay} onOpen={openEvent} mobile /></li>)}
            </ol>
          </div>
        </div>
      {selectedEvent && <ScheduleEventDialog event={selectedEvent} onClose={closeEvent} />}
    </section>
  );
}
