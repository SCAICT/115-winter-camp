import { testimonials } from '../data/campMemories';

export default function CampMemories() {
  return (
    <section id="testimonials" className="section memories-section" aria-labelledby="testimonials-title">
      <div className="wrap memories-heading" data-reveal>
        <h2 id="testimonials-title">學員回饋</h2>
      </div>
      <div className="wrap memories-quotes">
        <div className="testimonials-grid">
          {testimonials.map(({ quote, name, camp }, index) => (
            <figure className="testimonial-card" key={name} data-reveal style={{ '--reveal-delay': `${index * 100}ms` }}>
              <span className="testimonial-card__mark" aria-hidden="true">“</span>
              <blockquote><p>{quote}</p></blockquote>
              <figcaption><strong>{name}</strong><span>{camp} 學員</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
