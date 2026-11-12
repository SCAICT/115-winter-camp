import { useEffect, useRef, useState } from 'react';

// 單列輪播：內容重複兩份，捲動一份寬度後無縫接回開頭。
// 滑鼠移入、鍵盤聚焦、離開畫面或使用者偏好減少動態時暫停；手動捲動後從該位置繼續。
export default function useAutoScroll(speed = .025) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollerRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onChange = (event) => setReducedMotion(event.matches);
    media.addEventListener('change', onChange);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(scrollerRef.current);
    return () => {
      media.removeEventListener('change', onChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hovered || focused || reducedMotion || !visible) return undefined;
    const scroller = scrollerRef.current;
    let position = scroller.scrollLeft;
    let lastWritten = scroller.scrollLeft;
    let previousTime;
    let frame;
    const step = (time) => {
      const distance = copyRef.current.getBoundingClientRect().width;
      if (previousTime !== undefined && distance > 0) {
        if (scroller.scrollLeft !== lastWritten) position = scroller.scrollLeft;
        position = (position + Math.min(time - previousTime, 64) * speed) % distance;
        scroller.scrollLeft = position;
        lastWritten = scroller.scrollLeft;
      }
      previousTime = time;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [hovered, focused, reducedMotion, visible, speed]);

  return {
    scrollerRef,
    copyRef,
    wallProps: {
      onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHovered(true); },
      onPointerLeave: () => setHovered(false),
    },
    scrollerProps: {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}
