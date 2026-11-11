import { campFaqs } from '../data/campGuide';
import { winterCamp } from '../data/winterCamp';

export default function CampFaq() {
  return (
    <section id="faq" className="section camp-faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="guide-heading" data-reveal><div><h2 id="faq-title">常見問題</h2></div></div>
        <div className="camp-faq__list" data-reveal>
          {campFaqs.map((item, index) => (
            <details className="camp-faq__item" key={item.id} name="camp-faq">
              <summary><span className="camp-faq__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{item.question}</span><span className="camp-faq__icon" aria-hidden="true">+</span></summary>
              <div className="camp-faq__answer"><p>{item.answer}</p>{item.link && <a className="guide-text-link" href={item.link.href}>{item.link.label} <span aria-hidden="true">↗</span></a>}</div>
            </details>
          ))}
        </div>
        <div className="camp-faq__contact" data-reveal><p>還有其他問題？直接找我們聊聊。</p><div className="guide-links"><a href={winterCamp.instagram} target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">↗</span></a><a href={`mailto:${winterCamp.email}`}>Email <span aria-hidden="true">↗</span></a></div></div>
      </div>
    </section>
  );
}
