import { photoArchives } from '../data/campMemories';
import SubpageLayout from './SubpageLayout';

// 歷屆營隊相簿 子頁：首頁的照片牆只放縮圖輪播，這裡依年度列出所有照片。
export default function PhotosPage() {
  return (
    <SubpageLayout skipTo="#photo-archives" skipLabel="跳到營隊相簿">
      <section className="section subpage-section photos-page" aria-labelledby="photos-page-title">
        <div className="wrap">
          <a className="topics-back" href="/#photos" data-reveal><span aria-hidden="true">←</span> 回到首頁</a>
          <div className="about__intro" data-reveal>
            <h1 id="photos-page-title">歷屆營隊相簿</h1>
          </div>
          <div id="photo-archives">
            {photoArchives.map(({ year, title, photos }) => (
              <section className="photos-page__year" aria-labelledby={`photos-${year}`} key={year}>
                <h2 id={`photos-${year}`} data-reveal>{title}<span>{photos.length} 張</span></h2>
                <ul className="photos-page__grid">
                  {photos.map((src, index) => (
                    <li key={src}>
                      <img src={src} alt={`${title}照片 ${index + 1}`} width="1600" height="1067" loading="lazy" decoding="async" />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
