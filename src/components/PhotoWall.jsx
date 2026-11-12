import { useEffect, useRef, useState } from 'react';
import { wallPhotos } from '../data/campMemories';
import useIdleReady from '../hooks/useIdleReady';

// 圖片真正載入前先放 1×1 的透明圖，避免瀏覽器把 alt 文字畫在格子裡。
const blank = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// Three-row bento modules, following the SITCON photo wall's large, wide and tall rhythm.
const placements = [
  ['1 / 1 / 3 / 3', '1 / 3 / 2 / 4', '2 / 3 / 3 / 4', '3 / 1 / 4 / 3', '3 / 3 / 4 / 4'],
  ['1 / 2 / 3 / 4', '1 / 1 / 2 / 2', '2 / 1 / 3 / 2', '3 / 1 / 4 / 2', '3 / 2 / 4 / 4'],
  ['1 / 1 / 2 / 3', '1 / 3 / 3 / 4', '2 / 1 / 4 / 2', '2 / 2 / 3 / 3', '3 / 2 / 4 / 4'],
];
// 每個格子實際顯示多大，決定瀏覽器該挑哪一張縮圖。牆高 540（手機 360）、模組為 3×3 的正方形、
// 間距 10（手機 8）；object-fit: cover 需要的寬度，是「格子寬」與「格子高 × 4/3」中較大的那個。
const tileSizes = (area) => {
  const [rowStart, columnStart, rowEnd, columnEnd] = area.split(' / ').map(Number);
  const needed = (wall, gap) => {
    const cell = (wall - 2 * gap) / 3;
    const width = (columnEnd - columnStart) * cell + (columnEnd - columnStart - 1) * gap;
    const height = (rowEnd - rowStart) * cell + (rowEnd - rowStart - 1) * gap;
    return Math.round(Math.max(width, height * 4 / 3));
  };
  return `(max-width: 767px) ${needed(360, 8)}px, ${needed(540, 10)}px`;
};
const modules = Array.from({ length: Math.ceil(wallPhotos.length / 5) }, (_, index) =>
  wallPhotos.slice(index * 5, index * 5 + 5).map((photo, tile) => ({
    ...photo,
    area: placements[index % placements.length][tile],
  })));

function useSpotlight() {
  const layerRef = useRef(null);
  const motion = useRef({ current: [0, 0, 0, 0], target: [0, 0, 0, 0], frame: 0, time: 0 });

  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);

  const paint = () => {
    ['left', 'top', 'width', 'height'].forEach((name, index) => {
      layerRef.current?.style.setProperty(`--spotlight-${name}`, `${motion.current.current[index]}px`);
    });
  };

  const step = (time) => {
    const state = motion.current;
    const ease = 1 - Math.exp(-(time - state.time) / 120);
    state.time = time;
    state.current = state.current.map((value, index) => value + (state.target[index] - value) * ease);
    paint();
    state.frame = state.current.every((value, index) => Math.abs(state.target[index] - value) < .5)
      ? 0 : requestAnimationFrame(step);
  };

  const clear = () => {
    if (layerRef.current) delete layerRef.current.dataset.active;
    cancelAnimationFrame(motion.current.frame);
    motion.current.frame = 0;
  };

  const onPointerOver = (event) => {
    const layer = layerRef.current;
    const photo = event.target.closest('.photo-wall__tile');
    if (event.pointerType !== 'mouse' || !layer || !photo) return;
    const wall = layer.getBoundingClientRect();
    const rect = photo.getBoundingClientRect();
    const state = motion.current;
    state.target = [rect.left - wall.left, rect.top - wall.top, rect.width, rect.height];
    if (!('active' in layer.dataset) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelAnimationFrame(state.frame);
      state.frame = 0;
      state.current = [...state.target];
      paint();
    } else if (!state.frame) {
      state.time = performance.now();
      state.frame = requestAnimationFrame(step);
    }
    layer.dataset.active = '';
  };

  return { layerRef, onPointerOver, clear };
}

export default function PhotoWall() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollerRef = useRef(null);
  const copyRef = useRef(null);
  const { layerRef, onPointerOver, clear } = useSpotlight();
  const imagesReady = useIdleReady();

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
        // Continue from a touch, wheel or keyboard scroll instead of snapping back.
        if (scroller.scrollLeft !== lastWritten) position = scroller.scrollLeft;
        position = (position + Math.min(time - previousTime, 64) * .025) % distance;
        scroller.scrollLeft = position;
        lastWritten = scroller.scrollLeft;
      }
      previousTime = time;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [hovered, focused, reducedMotion, visible]);

  return (
    <div className="memories-photos" id="photos">
      <div className="photo-wall" onPointerOver={onPointerOver} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => { setHovered(false); clear(); }}>
        <div ref={scrollerRef} id="photo-wall-scroller" className="photo-wall__scroller" role="region" aria-label="歷屆營隊照片牆" tabIndex={0} onWheel={clear} onKeyDown={clear} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <div className="photo-wall__track">
            {[0, 1].map((copy) => (
              <div ref={copy === 0 ? copyRef : undefined} className="photo-wall__copy" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {modules.map((photos, moduleIndex) => (
                  <div className="photo-wall__module" key={moduleIndex}>
                    {photos.map(({ id, src, srcSet, caption, area }) => (
                      <figure className="photo-wall__tile" style={{ gridArea: area }} key={id}>
                        <img src={imagesReady ? src : blank} srcSet={imagesReady ? srcSet : undefined} sizes={tileSizes(area)} alt={copy === 0 ? caption : ''} width="1200" height="900" loading="lazy" decoding="async" draggable="false" />
                        <figcaption>{caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div ref={layerRef} className="photo-wall__spotlight" aria-hidden="true"><div className="photo-wall__shade" /><div className="photo-wall__bloom" /></div>
      </div>
    </div>
  );
}
