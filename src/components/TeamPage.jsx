import SubpageLayout from './SubpageLayout';

// 認識籌備團隊 子頁：目前只有框架，籌備團隊成員資料公布後補在這裡。
export default function TeamPage() {
  return (
    <SubpageLayout skipTo="#team-content" skipLabel="跳到認識籌備團隊">
      <section id="team-content" className="section subpage-section" aria-labelledby="team-page-title">
        <div className="wrap">
          <a className="topics-back" href="/#about" data-reveal><span aria-hidden="true">←</span> 回到首頁</a>
          <div className="about__intro" data-reveal>
            <h1 id="team-page-title">認識籌備團隊</h1>
          </div>
          <p className="about-summary" data-reveal>籌備團隊介紹即將公布，敬請期待。</p>
          <div className="topics-actions" data-reveal>
            <a className="button" href="/#about">回到首頁 <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
