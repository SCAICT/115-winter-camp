import { courseTopics, teachingPoints, topicFlow } from '../data/campGuide';
import CampSchedule from './CampSchedule';
import SubpageLayout from './SubpageLayout';

// 課程主題子頁：首頁的 #topics 只放摘要，這裡放完整介紹、每個單元的學習成果、教學方式與四天課表。
export default function TopicsPage() {
  return (
    <SubpageLayout skipTo="#topic-list" skipLabel="跳到課程主題">
        <section className="section topics-section subpage-section" aria-labelledby="topics-page-title">
          <div className="wrap">
            <a className="topics-back" href="/#topics" data-reveal><span aria-hidden="true">←</span> 回到首頁</a>
            <div className="topics-intro">
              <div data-reveal>
                <h1 id="topics-page-title">課程主題</h1>
              </div>
              <div className="topics-intro__text" data-reveal style={{ '--reveal-delay': '100ms' }}>
                <p className="topics-lead">四天，走完一次從發現問題到修好它的完整循環。</p>
                <p>這次營隊聚焦 <strong>Web 攻防</strong>。前兩天以實作課學會看懂服務、驗證漏洞、分析證據與修補部署；後兩天和隊友接手同一套服務，一邊找出其他隊伍的破口，一邊守住自己的服務，還要讓正常使用者繼續使用。</p>
                <p>不用先會駭客技術，只要有基本電腦操作就能上手。具備變數、條件判斷與函式概念會更容易銜接，我們會提供行前教材。</p>
              </div>
            </div>

            <ol className="topics-flow" aria-label="攻防循環" data-reveal>
              {topicFlow.map((step, index) => (
                <li key={step}><span className="topics-flow__number" aria-hidden="true">{index + 1}</span><span>{step}</span></li>
              ))}
            </ol>

            <ol id="topic-list" className="topics-grid">
              {courseTopics.map(({ day, title, description, outcome, tags, featured }, index) => (
                <li className={`topic-card${featured ? ' topic-card--featured' : ''}`} key={title} data-reveal style={{ '--reveal-delay': `${(index % 3) * 100}ms` }}>
                  <div className="topic-card__top">
                    <span className="topic-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="topic-card__day">{day}</span>
                  </div>
                  <h2>{title}</h2>
                  <p className="topic-card__description">{description}</p>
                  <p className="topic-card__outcome"><span>你會做到</span>{outcome}</p>
                  <ul className="topic-card__tags" aria-label="涵蓋工具與概念">
                    {tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </li>
              ))}
            </ol>

            <ul className="topics-method" data-reveal>
              {teachingPoints.map(({ title, description }) => (
                <li key={title}><strong>{title}</strong><span>{description}</span></li>
              ))}
            </ul>

            <CampSchedule />

            <div className="topics-actions" data-reveal>
              <a className="button" href="/#ticket">查看盲鳥票 <span aria-hidden="true">↗</span></a>
              <a className="button topics-actions__secondary" href="/#faq">常見問題 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
    </SubpageLayout>
  );
}
