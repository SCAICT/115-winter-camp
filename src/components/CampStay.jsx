import { winterCamp } from '../data/winterCamp';
import useAutoScroll from '../hooks/useAutoScroll';

export default function CampStay() {
  const { accommodation } = winterCamp;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.mapQuery)}`;
  const { scrollerRef, copyRef, wallProps, scrollerProps } = useAutoScroll();

  return (
    <section id="stay" className="camp-stay guide-subsection" aria-labelledby="stay-title">
      <div className="guide-heading" data-reveal><div><h3 id="stay-title">營隊住宿</h3></div></div>
      <div className="camp-stay__intro" data-reveal>
        <h4>{accommodation.name}</h4>
        <div className="guide-links">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">查看住宿位置 <span aria-hidden="true">↗</span></a>
          <a href={accommodation.website} target="_blank" rel="noopener noreferrer">前往旅巷官網 <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="stay-wall" data-reveal {...wallProps}>
        <div ref={scrollerRef} className="stay-wall__scroller" role="region" aria-label="住宿環境照片" tabIndex={0} {...scrollerProps}>
          <div className="stay-wall__track">
            {[0, 1].map((copy) => (
              <div ref={copy === 0 ? copyRef : undefined} className="stay-wall__copy" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {accommodation.photos.map(({ src, alt, label, width, height }) => (
                  <figure className="stay-wall__tile" key={src} style={{ aspectRatio: `${width} / ${height}` }}>
                    <img src={src} alt={copy === 0 ? alt : ''} width={width} height={height} loading="lazy" decoding="async" draggable="false" />
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="camp-stay__photo-credit">照片來源：<a href={accommodation.website} target="_blank" rel="noopener noreferrer">旅巷自在官網</a></p>
    </section>
  );
}
