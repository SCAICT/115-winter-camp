import { useState } from 'react';
import { courseTopics, learningOutcomes, teachingPoints } from '../data/campGuide';
import CampSchedule from './CampSchedule';
import SubpageLayout from './SubpageLayout';
import TopicFlow from './TopicFlow';

// 單元卡：桌機／平板一律完整顯示；手機預設只顯示標題與描述，課程內容與實作目標點開才展開（以 CSS 控制，預先渲染的內容不變）。
function TopicCard({ topic: { day, title, description, items, outcome, featured }, index }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = `topic-details-${index + 1}`;

  return (
    <li className={`topic-card${featured ? ' topic-card--featured' : ''}${expanded ? ' is-expanded' : ''}`} data-reveal style={{ '--reveal-delay': `${(index % 3) * 100}ms` }}>
      <div className="topic-card__top">
        <span className="topic-card__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="topic-card__day">{day}</span>
      </div>
      <h3>{title}</h3>
      <p className="topic-card__description">{description}</p>
      <div className="topic-card__more" id={detailsId}>
        <div className="topic-card__content">
          <span>課程內容</span>
          <ul className="topic-card__items">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <p className="topic-card__outcome"><span>實作目標</span>{outcome}</p>
      </div>
      <button className="topic-card__toggle" type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => setExpanded((open) => !open)}>
        <span>{expanded ? '收合' : '查看課程內容與實作目標'}</span>
        <span className="topic-card__toggle-icon" aria-hidden="true" />
      </button>
    </li>
  );
}

// 課程主題子頁：首頁的 #topics 只放摘要，這裡放課程定位、五個學習階段、每個單元的課程內容與實作目標、學習成果、課程特色與四天課表。
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
                <p className="topics-lead">四天，走完一次從開發服務、發現問題到修復漏洞的完整循環。</p>
                <p>本次營隊以 <strong>Web 開發與資訊安全</strong>為核心，結合程式開發、漏洞分析、數位鑑識及團隊攻防競賽，讓學員不只學習如何尋找網站漏洞，更能理解 Web 服務的運作原理，親手建立、分析、修補並維護一套完整的服務。</p>
                <p>課程循序漸進：前兩天以技術教學與實作為主，從 Linux、網路通訊及 Web 後端開發開始，逐步學習漏洞驗證、安全修補與服務部署；第三、四天進入 Attack &amp; Defense（A&amp;D）團隊攻防競賽，將課堂所學應用於實際競賽環境。</p>
                <p>不用先會駭客技術，只要有基本電腦操作就能上手。具備變數、條件判斷與函式概念會更容易銜接，我們會提供行前教材。</p>
              </div>
            </div>

            <h2 className="topics-subheading" data-reveal>核心學習目標</h2>
            <TopicFlow detailed />

            <h2 className="topics-subheading" data-reveal>課程單元</h2>
            <ol id="topic-list" className="topics-grid">
              {courseTopics.map((topic, index) => <TopicCard topic={topic} index={index} key={topic.title} />)}
            </ol>

            <h2 className="topics-subheading" data-reveal>學習成果</h2>
            <ol className="topics-outcomes" data-reveal>
              {learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ol>

            <h2 className="topics-subheading" data-reveal>課程特色</h2>
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
