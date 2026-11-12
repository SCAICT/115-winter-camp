import { winterCamp, organizations } from './winterCamp.js';
import { campSchedule } from './campGuide.js';

const [startsOn, endsOn] = winterCamp.dates.split(' ~ ');
const year = startsOn.slice(0, 4);
const firstDay = campSchedule.days[0];
const lastDay = campSchedule.days.at(-1);
const organizer = organizations.find(({ label }) => label === '主辦單位').members[0];

export const siteSeo = {
  url: 'https://wc.scaict.org/',
  title: `${winterCamp.name}｜4 天 3 夜冬令營`,
  description: `${winterCamp.name}是以高中生為主的寒假資訊營隊，${year} 年 ${Number(startsOn.slice(5, 7))} 月 ${Number(startsOn.slice(8, 10))}–${Number(endsOn.slice(8, 10))} 日於${winterCamp.venue}舉辦。四天營隊以 Web 攻防為主題，包含 Linux、HTTP 與漏洞修補課程、團隊攻防競賽、講座與成果發表，歡迎程式初學者參加。查看營隊課表、報名費用與住宿安排。`,
  image: 'https://wc.scaict.org/img/gallery-optimized/hero.webp',
  imageAlt: 'SCAICT 歷屆資訊營隊的學員交流與實作活動',
};

// 課程主題子頁：首頁只放摘要，完整介紹在這裡（由 scripts/build.mjs 輸出 dist/topics/index.html）。
export const topicsSeo = {
  path: '/topics/',
  url: `${siteSeo.url}topics/`,
  title: `課程主題｜${winterCamp.name}`,
  description: `${winterCamp.name}的 Web 攻防課程主題：Linux 與 HTTP、越權與 SQL Injection 漏洞驗證、封包與 Log 事件還原、Git 測試部署，以及兩天的團隊攻防競賽。了解每個單元的學習目標與實作成果。`,
};
export const aboutSeo = {
  path: '/about/',
  url: `${siteSeo.url}about/`,
  title: `關於我們｜SCAICT 中電會｜${winterCamp.name}`,
  description: `認識主辦單位中部高中電資社團聯合會議（SCAICT，簡稱中電會）：2021 年發起，串連中部高中職資訊社團，持續辦理資訊教育、活動與比賽，並主辦${winterCamp.name}。`,
};

// 預先輸出的子頁清單：build 與 App 路由都由此讀取。
export const subpages = [topicsSeo, aboutSeo];
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://scaict.org/#organization',
      name: `${organizer.shortName} ${organizer.name}`,
      url: organizer.href,
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
          validFrom: `${period.startsOn}T00:00:00+08:00`,
          validThrough: `${period.endsOn}T23:59:59+08:00`,
        })),
      } : {}),
    },
  ],
};
