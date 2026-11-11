import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getTaipeiDate(now = new Date()) {
  const parts = Object.fromEntries(formatter.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export default function useTaipeiDate() {
  // Keep the build-time HTML and the first browser render identical, even days after a build.
  const [today, setToday] = useState(null);

  useEffect(() => {
    let timer;
    const update = () => {
      const now = new Date();
      const date = getTaipeiDate(now);
      setToday(date);
      // Refresh at Taiwan midnight, including pages left open across a stage change.
      const nextMidnight = new Date(`${date}T00:00:00+08:00`).getTime() + 24 * 60 * 60 * 1000;
      window.clearTimeout(timer);
      timer = window.setTimeout(update, Math.max(1, nextMidnight - now.getTime()));
    };
    const onVisibilityChange = () => {
      if (!document.hidden) update();
    };

    update();
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return today;
}
