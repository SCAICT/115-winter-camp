import CountUp from './CountUp';
import SubpageLayout from './SubpageLayout';

// 關於我們 子頁：首頁的 #about 只放簡介，完整介紹與數據在這裡。
export default function AboutPage() {
  return (
    <SubpageLayout skipTo="#about-content" skipLabel="跳到關於我們">
      <section id="about-content" className="section about-section subpage-section" aria-labelledby="about-page-title">
        <div className="wrap">
          <a className="topics-back" href="/#about" data-reveal><span aria-hidden="true">←</span> 回到首頁</a>
          <div className="about__layout">
            <div className="about__intro" data-reveal>
              <h1 id="about-page-title">關於我們</h1>
            </div>
            <div className="about__content"><p className="about__description" data-reveal>中部高中電資社團聯合會議（SCAICT），簡稱「中電會」。2021 年 12 月 7 日，在 AIS3 新型態資安實務主題課程中，臺灣科技大學資訊工程系鄭欣明教授與陽明交通大學資訊工程系黃俊穎教授，提出將中部所有資訊社團聯合起來，成為一個「大組織」的構想，發起「中部高中職電資聯合會議」。</p>
              <p className="about__description" data-reveal>以結合中區電資資源為起點，積極辦理資訊教育、活動與比賽，讓各校社團彼此交流、共同成長，並將經驗與資源持續傳承下去。</p>
            </div>
          </div>
          <dl className="about__stats">
            <div data-reveal><dt>深耕中部教育</dt><dd><CountUp value={5} /><span>年</span><span>+</span></dd></div>
            <div data-reveal style={{ '--reveal-delay': '100ms' }}><dt>聯合參與社團</dt><dd><CountUp value={23} /><span>個</span><span>+</span></dd></div>
            <div data-reveal style={{ '--reveal-delay': '200ms' }}><dt>熱愛資訊的夥伴</dt><dd><CountUp value={2000} /><span>人</span><span>+</span></dd></div>
          </dl>
          <div className="topics-actions" data-reveal>
            <a className="button" href="https://scaict.org/" target="_blank" rel="noopener noreferrer">前往 SCAICT 官網 <span aria-hidden="true">↗</span></a>
            <a className="button topics-actions__secondary" href="/#organizers">主辦與協辦單位 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
