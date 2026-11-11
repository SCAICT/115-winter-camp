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
  description: `${winterCamp.name}是以高中生為主的寒假資訊營隊，${year} 年 ${Number(startsOn.slice(5, 7))} 月 ${Number(startsOn.slice(8, 10))}–${Number(endsOn.slice(8, 10))} 日於${winterCamp.venue}舉辦。四天營隊包含課程、講座、黑客松與成果發表，歡迎程式初學者參加。查看營隊課表、報名費用與住宿安排。`,
  image: 'https://wc.scaict.org/img/gallery-optimized/hero.webp',
  imageAlt: 'SCAICT 歷屆資訊營隊的學員交流與實作活動',
};

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
      description: '以高中生為主的寒假資訊營隊，透過課程、講座、黑客松與成果發表，一起學習、實作並認識喜歡資訊的夥伴。歡迎沒有程式基礎的初學者參加。',
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
