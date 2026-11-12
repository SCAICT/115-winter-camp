import { campSchedule, courseTopics } from '../data/campGuide';
import { topicsSeo } from '../data/siteSeo';
import TopicFlow from './TopicFlow';

const weekday = new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', weekday: 'short' });
const dateLabel = (date) => `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`;

// 'DAY 1' / 'DAY 1–2' → 起訖天數，用來決定主題在四欄地圖上的位置。
const dayRange = (label) => {
  const [start, end = start] = label.match(/\d/g).map(Number);
  return { start, span: end - start + 1 };
};

// 首頁只放大概：五個學習階段與「四天地圖」（每個主題落在哪幾天），完整主題介紹與四天課表在 /topics/ 子頁。
export default function CampTopics() {
  return (
    <section id="topics" className="section topics-section" aria-labelledby="topics-title">
      <div className="wrap">
        <div className="topics-intro">
          <div data-reveal>
            <h2 id="topics-title">課程主題</h2>
          </div>
          <div className="topics-intro__text" data-reveal style={{ '--reveal-delay': '100ms' }}>
            <p className="topics-lead">四天，走完一次從開發服務、發現問題到修復漏洞的完整循環。</p>
            <p>這個寒假營隊以 Web 開發與資訊安全為核心，結合程式開發、漏洞分析、數位鑑識及團隊攻防競賽。<span className="topics-intro__detail">前兩天從 Linux、網路通訊與 Web 後端開發開始，逐步學習漏洞驗證、安全修補與服務部署；第三、四天進入 Attack &amp; Defense 團隊攻防競賽，把課堂所學用在實際競賽環境。</span>不用先會駭客技術，有基本電腦操作就能上手。</p>
          </div>
        </div>

        <TopicFlow />

        <div className="topics-map">
          <div className="topics-map__days" aria-hidden="true" data-reveal>
            {campSchedule.days.map((day, index) => (
              <div key={day.date}>
                <strong>DAY {String(index + 1).padStart(2, '0')}</strong>
                <time dateTime={day.date}>{dateLabel(day.date)} {weekday.format(new Date(`${day.date}T12:00:00+08:00`))}</time>
              </div>
            ))}
          </div>

          <ol className="topics-map__list">
            {courseTopics.map(({ day, title, summary, outcome, items, featured }, index) => {
              const { start, span } = dayRange(day);
              return (
                <li
                  className={`topics-map__item${featured ? ' topics-map__item--featured' : span > 1 ? ' topics-map__item--wide' : ''}`}
                  key={title}
                  data-reveal
                  style={{ '--col-start': start, '--col-span': span, '--reveal-delay': `${(index % 3) * 90}ms` }}
                >
                  <div className="topics-map__top">
                    <span className="topics-map__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  {featured && (
                    <>
                      <p className="topics-map__outcome"><span>實作目標</span>{outcome}</p>
                      <ul className="topics-map__tags" aria-label="競賽內容">
                        {items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
            <li className="topics-map__more" data-reveal style={{ '--col-start': 3, '--col-span': 2, '--reveal-delay': '180ms' }}>
              <a href={topicsSeo.path}>
                <span><strong>課程主題詳細介紹與四天課表</strong><span className="topics-map__more-desc">每個單元的課程內容與實作目標、學習成果，以及逐時段的課表。</span></span>
                <span className="topics-map__more-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
