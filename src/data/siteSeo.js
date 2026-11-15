import { winterCamp, organizations } from './winterCamp.js';
import { campFaqs, campSchedule } from './campGuide.js';

const [startsOn, endsOn] = winterCamp.dates.split(' ~ ');
const year = startsOn.slice(0, 4);
const firstDay = campSchedule.days[0];
const lastDay = campSchedule.days.at(-1);
const organizer = organizations.find(({ label }) => label === '主辦單位').members[0];

export const siteSeo = {
  url: 'https://wc.scaict.org/',
  // 標題與摘要控制在搜尋結果不會被截斷的長度（標題約 30 個中文字寬、摘要約 80 個中文字）；重點放前面。
  title: `${winterCamp.name}｜Web 攻防 4 天 3 夜冬令營`,
  description: `${year} 年 ${Number(startsOn.slice(5, 7))} 月 ${Number(startsOn.slice(8, 10))}–${Number(endsOn.slice(8, 10))} 日於${winterCamp.venue}舉辦的高中生寒假資訊營隊。學習 Linux、HTTP 與漏洞修補，參加團隊攻防競賽，還有講座、破冰、晚會與社群攤位，歡迎初學者報名。`,
  // 社群分享圖：1200×630 的 PNG 或 JPEG。換圖時直接覆蓋這個檔案；若改成 JPEG，連 image、imageType 一起改。
  // tests/seo.test.mjs 會檢查實際檔案的尺寸與格式是否和這裡宣告的一致。
  image: 'https://wc.scaict.org/img/og-winter-2027.png',
  imageType: 'image/png',
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: `${winterCamp.name} 主視覺，${year} 年 ${Number(startsOn.slice(5, 7))} 月 ${Number(startsOn.slice(8, 10))}–${Number(endsOn.slice(8, 10))} 日於${winterCamp.venue}舉辦`,
  // 搜尋結果、網站圖示與結構化資料共用的品牌圖示（由 npm run icons 產生）。
  logo: 'https://wc.scaict.org/apple-touch-icon.png',
};

// 子頁：name 是麵包屑（搜尋結果網址旁的路徑）顯示的名稱；title、description 控制在搜尋結果不會被截斷的長度。
// 課程主題子頁：首頁只放摘要，完整介紹在這裡（由 scripts/build.mjs 輸出 dist/topics/index.html）。
export const topicsSeo = {
  path: '/topics/',
  url: `${siteSeo.url}topics/`,
  name: '課程主題',
  title: `課程主題｜${winterCamp.name}`,
  description: `Web 攻防四天課程：Linux、HTTP 請求分析、Flask 後端、IDOR 與 SQL Injection 漏洞修補、數位鑑識、Git 與 Docker 部署，最後以團隊攻防競賽驗收成果。`,
};
export const aboutSeo = {
  path: '/about/',
  url: `${siteSeo.url}about/`,
  name: '關於我們',
  title: `關於中電會 SCAICT｜${winterCamp.name}`,
  description: `中部高中電資社團聯合會議（SCAICT，簡稱中電會）於 2021 年發起，串連中部高中職資訊社團，持續辦理資訊教育、活動與比賽，也是${winterCamp.name}的主辦單位。`,
};
export const photosSeo = {
  path: '/photos/',
  url: `${siteSeo.url}photos/`,
  name: '歷屆營隊相簿',
  title: `歷屆營隊相簿｜${winterCamp.name}`,
  description: `SCAICT 歷屆聯合寒訓的完整照片，收錄課堂實作、團隊討論與學員交流的現場紀錄。`,
};

// 預先輸出的子頁清單：build 與 App 路由都由此讀取。
export const subpages = [topicsSeo, aboutSeo, photosSeo];

// 子頁的麵包屑結構化資料：讓搜尋結果的網址顯示成「首頁 › 課程主題」而不是一長串路徑。
export const breadcrumbData = ({ name, url }) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: winterCamp.name, item: siteSeo.url },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://scaict.org/#organization',
      name: `${organizer.shortName} ${organizer.name}`,
      url: organizer.href,
      logo: siteSeo.logo,
      email: winterCamp.email,
      sameAs: [winterCamp.instagram],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteSeo.url}#website`,
      name: winterCamp.name,
      url: siteSeo.url,
      description: siteSeo.description,
      inLanguage: 'zh-Hant',
      publisher: { '@id': 'https://scaict.org/#organization' },
    },
    {
      '@type': 'EducationEvent',
      '@id': `${siteSeo.url}#event`,
      name: winterCamp.name,
      url: siteSeo.url,
      description: '以高中生為主的寒假資訊營隊，以 Web 攻防為主題，透過 Linux、HTTP 與漏洞修補課程、團隊攻防競賽、講座與成果發表，一起學習、實作並認識喜歡資訊的夥伴。歡迎沒有程式基礎的初學者參加。',
      startDate: `${startsOn}T${firstDay.events[0].start}:00+08:00`,
      endDate: `${endsOn}T${lastDay.events.at(-1).end}:00+08:00`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      inLanguage: 'zh-Hant',
      // 高中生為主；歡迎初學者。
      typicalAgeRange: '15-18',
      keywords: '寒假營隊, 資訊營, 高中生, Web 攻防, 資訊安全, 漏洞修補, 團隊攻防競賽, SCAICT, 中電會',
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      image: [siteSeo.image],
      location: {
        '@type': 'Place',
        name: winterCamp.venue,
        address: {
          '@type': 'PostalAddress',
          streetAddress: winterCamp.venueAddress.streetAddress,
          addressLocality: winterCamp.venueAddress.addressLocality,
          addressCountry: winterCamp.venueAddress.addressCountry,
        },
      },
      organizer: { '@id': 'https://scaict.org/#organization' },
      ...(winterCamp.ticket.url ? {
        offers: winterCamp.ticket.registrationPeriods.map((period) => ({
          '@type': 'Offer',
          name: `${period.name}票`,
          url: winterCamp.ticket.url,
          price: winterCamp.ticket.plans.find(({ name }) => name === period.plan).price,
          priceCurrency: 'TWD',
          availability: 'https://schema.org/InStock',
          validFrom: `${period.startsOn}T00:00:00+08:00`,
          validThrough: `${period.endsOn}T23:59:59+08:00`,
        })),
      } : {}),
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteSeo.url}#faq`,
      mainEntity: campFaqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};
