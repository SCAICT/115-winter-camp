import { calendarPath, winterCamp } from './winterCamp.js';

// 「加入行事曆」用的 .ics：營期與各階段報名截止日。由 scripts/build.mjs 在建置時輸出到 dist，
// 資料直接取自 winterCamp.js，改日期或報名階段後重新建置就會同步。
export { calendarPath };

const siteUrl = 'https://wc.scaict.org/';
const compactDate = (date) => date.replaceAll('-', '');
const nextDay = (date) => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
};
const escapeText = (text) => text.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');

// RFC 5545：每行最多 75 個位元組，超過要折行（下一行以空白開頭）。中文字佔 3 個位元組，不能從字元中間切開。
function fold(line) {
  const parts = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function buildCalendar(now = new Date()) {
  const [startsOn, endsOn] = winterCamp.dates.split(' ~ ');
  const { streetAddress, addressLocality } = winterCamp.venueAddress;
  const stamp = now.toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');

  const events = [
    {
      uid: 'camp',
      summary: winterCamp.name,
      start: startsOn,
      end: nextDay(endsOn),
      location: `${winterCamp.venue}，${addressLocality}${streetAddress}`,
      description: `營隊詳細資訊與課表：${siteUrl}`,
    },
    ...winterCamp.ticket.registrationPeriods.map((period) => ({
      uid: `registration-${period.startsOn}`,
      summary: `${winterCamp.name}｜${period.name}報名截止`,
      start: period.endsOn,
      end: nextDay(period.endsOn),
      description: `截止日當天 23:59 結束（台灣時間）。報名資訊：${siteUrl}#ticket`,
      // 全天活動：-PT15H 是前一天早上 9 點提醒。
      reminder: '-PT15H',
    })),
  ];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SCAICT//2027 Winter Camp//ZH-TW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`${winterCamp.name} 重要時程`)}`,
    'X-WR-TIMEZONE:Asia/Taipei',
    ...events.flatMap((event) => [
      'BEGIN:VEVENT',
      `UID:${event.uid}@wc.scaict.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compactDate(event.start)}`,
      `DTEND;VALUE=DATE:${compactDate(event.end)}`,
      `SUMMARY:${escapeText(event.summary)}`,
      ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
      `DESCRIPTION:${escapeText(event.description)}`,
      `URL:${siteUrl}`,
      // 營期要顯示為忙碌；截止日只是提醒，不佔用時間。
      `TRANSP:${event.reminder ? 'TRANSPARENT' : 'OPAQUE'}`,
      ...(event.reminder ? ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapeText(event.summary)}`, `TRIGGER:${event.reminder}`, 'END:VALARM'] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
