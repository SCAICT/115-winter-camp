import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value }) {
  const [display, setDisplay] = useState(value);
  const elementRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return undefined;

    let frame;
    let startedAt;
    const step = (time) => {
      startedAt ??= time;
      const progress = Math.min((time - startedAt) / 1400, 1);
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      frame = requestAnimationFrame(step);
    }, { threshold: .6 });

    const finish = () => {
      if (!media.matches) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      setDisplay(value);
    };

    setDisplay(0);
    observer.observe(elementRef.current);
    media.addEventListener('change', finish);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener('change', finish);
    };
  }, [value]);

  return (
    <span ref={elementRef} className="count-up" style={{ '--count-digits': String(value).length }} aria-live="off">
      {display}
    </span>
  );
}
