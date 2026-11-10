import { testimonials } from '../data/campMemories';
import PhotoWall from './PhotoWall';

export default function CampMemories() {
  return (
    <section id="testimonials" className="section memories-section" aria-labelledby="testimonials-title">
      <div className="wrap memories-heading">
        <h2 id="testimonials-title">學員回饋</h2>
        <p>歷屆營隊的課堂、交流與合影，還有學員留下的話。</p>
      </div>
      <div className="wrap memories-quotes">
        <div className="testimonials-grid">
          {testimonials.map(({ quote, name, camp }) => (
            <figure className="testimonial-card" key={name}>
              <span className="testimonial-card__mark" aria-hidden="true">“</span>
              <blockquote><p>{quote}</p></blockquote>
              <figcaption><strong>{name}</strong><span>{camp} 學員</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
      <PhotoWall />
    </section>
  );
}
