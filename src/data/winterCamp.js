// 2027 聯合寒訓已確認的資訊集中在這裡；未公布的欄位維持 null。
export const winterCamp = {
  name: 'SCAICT 2027 聯合寒訓',
  venue: '國立中興大學',
  // 校園地址依國立中興大學資訊工程學系官網；實際報到教室見課表。
  venueAddress: {
    streetAddress: '南區興大路 145 號',
    addressLocality: '臺中市',
    addressCountry: 'TW',
  },
  dates: '2027-01-21 ~ 2027-01-24',
  instagram: 'https://www.instagram.com/scaict.tw/',
  email: 'contact@scaict.org',
  accommodation: {
    name: '旅巷自在輕旅 Loosha Hostel',
    website: 'https://loosha.com.tw/',
    photos: [
      // 官網首頁與公共設施頁照片，下載至 public/img。
      { src: '/img/loosha-dorm.jpg', alt: '旅巷自在背包房，設有床簾的上下舖與置物櫃', label: '八床背包房', width: 800, height: 600 },
      { src: '/img/loosha-four-bed.jpg', alt: '旅巷自在四床背包房，採光明亮並設有獨立床簾', label: '四床背包房', width: 800, height: 600 },
      { src: '/img/loosha-female-dorm.jpg', alt: '旅巷自在女生背包房，設有上下舖與置物櫃', label: '女生背包房', width: 800, height: 600 },
      { src: '/img/loosha-lounge.jpg', alt: '旅巷自在咖啡廳吧檯與座位區', label: '咖啡吧檯', width: 800, height: 533 },
      { src: '/img/loosha-cafe.jpg', alt: '旅巷自在公共空間的窗邊長桌與座椅', label: '窗邊休憩區', width: 800, height: 533 },
      { src: '/img/loosha-bathroom.jpg', alt: '旅巷自在共用衛浴的獨立淋浴間', label: '衛浴空間', width: 800, height: 1200 },
    ],
    mapQuery: '旅巷自在輕旅 Loosha Hostel 臺中',
    transfer: '會場與住宿地點之間由主辦單位安排計程車接送。',
    roomDetails: null,
  },
  ticket: {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSe2_E_uJ3fPDUHF4w5PBSqRDzpPn6iYbFqGg5Sb2kC7JKvn6Q/viewform?usp=dialog',
    includes: ['住宿', '餐食', '場地', '保險'],
    quantity: '不限',
    registrationPeriods: [
      { name: '盲鳥', plan: '盲鳥', startsOn: '2026-11-15', endsOn: '2026-11-30' },
      { name: '早鳥', plan: '早鳥', startsOn: '2026-12-01', endsOn: '2026-12-20' },
      { name: '學員', plan: '單人', startsOn: '2026-12-21', endsOn: '2027-01-10' },
    ],
    // 所有票種皆含住宿；金額單位：新臺幣／每位學員。
    plans: [
      { name: '單人', price: 4599 },
      { name: '盲鳥', price: 3999 },
      { name: '早鳥', price: 4399 },
      { name: '雙人', price: 4399 },
      { name: '三人', price: 4199 },
      { name: '四人', price: 4099 },
    ],
  },
};

export const organizations = [
  {
    label: '主辦單位',
    members: [
      { shortName: 'SCAICT', name: '中部高中電資社團聯合會議', href: 'https://scaict.org/', logo: '/img/LOGO/SCAICT.webp', desc: '由中部高中資訊與電資社團共同串聯的學生組織，致力於連結社群、推動技術交流與資訊教育扎根。' },
    ],
  },
  {
    label: '協辦單位',
    members: [
      { shortName: 'SCINT', name: '北臺灣學生資訊社群', href: 'https://scint.org/', logo: '/img/LOGO/scint.webp', desc: '匯聚北台灣各高中資訊社群，串連人才、共享資源，與 SCAICT 攜手推動學生技術交流。' },
      { shortName: 'SCIST', name: '南臺灣學生資訊社群', href: 'https://scist.org/', logo: '/img/LOGO/scist.webp', desc: '深耕南台灣資訊教育，涵蓋演算法、資安與程式競賽，與 SCAICT 共同縮短南北技術資源差距。' },
      { shortName: 'NCSE', name: 'NCSE Network', href: 'https://ncse.tw/', logo: 'https://cdn-file.ncse.tw/image/Logo_NCSE_Network_Banner.svg', desc: '提供網路與技術支援，協助推動本營隊的數位化運作。' },
      { shortName: 'OCF', name: '開放文化基金會', href: 'https://ocf.tw/', logo: '/img/LOGO/ocf.webp', desc: '推動開放文化與開源精神，支持本營隊的開源教育理念。' },
      { shortName: 'GOSCUP', name: '科斯高有限公司', href: 'https://goscup.com/', logo: '/img/LOGO/goscup.webp', desc: '科斯高 (GOSCUP) 有限公司是一家成立於 2011 年的臺灣社會企業，旨在推廣開源軟硬體及開放資料。自創立起即持續以法人身份服務社群籌辦大型會議、研討會與黑客松，並支持在地社群倡導開放技術的使用。' },
    ],
  },
];
