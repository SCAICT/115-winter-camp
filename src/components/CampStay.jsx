import { winterCamp } from '../data/winterCamp';

export default function CampStay() {
  const { accommodation } = winterCamp;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(accommodation.mapQuery)}`;

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
      <div className="camp-stay__photos">
        {accommodation.photos.map(({ src, alt, label, width, height }, index) => (
          <figure className="camp-stay__photo" key={src} tabIndex={0} data-reveal style={{ '--reveal-delay': `${(index % 3) * 80}ms` }}>
            <div className="camp-stay__photo-frame">
              <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
            </div>
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
      <p className="camp-stay__photo-credit">照片來源：<a href={accommodation.website} target="_blank" rel="noopener noreferrer">旅巷自在官網</a></p>
    </section>
  );
}
