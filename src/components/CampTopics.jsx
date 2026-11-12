import { courseTopics, topicFlow } from '../data/campGuide';
import { topicsSeo } from '../data/siteSeo';

// 首頁只放大概：循環流程與六個主題的一句話介紹，完整主題介紹與四天課表在 /topics/ 子頁。
export default function CampTopics() {
  return (
    <section id="topics" className="section topics-section" aria-labelledby="topics-title">
      <div className="wrap">
        <div className="topics-intro">
          <div data-reveal>
            <h2 id="topics-title">課程主題</h2>
          </div>
          <div className="topics-intro__text" data-reveal style={{ '--reveal-delay': '100ms' }}>
            <p className="topics-lead">四天，走完一次從發現問題到修好它的完整循環。</p>
            <p>這個寒假營隊聚焦 Web 攻防：前兩天以實作課學會看懂服務、驗證漏洞與修補部署，後兩天和隊友接手同一套 Web 服務，攻擊其他隊伍、守住自己的服務。不用先會駭客技術，有基本電腦操作就能上手。</p>
          </div>
        </div>

        <ol className="topics-flow" aria-label="攻防循環" data-reveal>
          {topicFlow.map((step, index) => (
            <li key={step}><span className="topics-flow__number" aria-hidden="true">{index + 1}</span><span>{step}</span></li>
          ))}
        </ol>

        <ol className="topics-list" data-reveal>
          {courseTopics.map(({ day, title, description }, index) => (
            <li key={title}>
              <span className="topics-list__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="topics-list__body"><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>

        <a className="button topics-more" href={topicsSeo.path} data-reveal>查看課程主題詳細介紹與四天課表 <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
