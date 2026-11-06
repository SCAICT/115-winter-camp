// 2027 聯合寒訓已確認的資訊集中在這裡；未公布的欄位維持 null。
export const winterCamp = {
  name: 'SCAICT 2027 聯合寒訓',
  venue: '國立中興大學',
  dates: '2027-01-21 ~ 2027-01-24',
  instagram: 'https://www.instagram.com/scaict.tw/',
  email: 'contact@scaict.org',
  ticket: {
    url: null,
    salesStart: null,
    salesEnd: null,
    quantity: null,
    // 金額單位：新臺幣／每位學員。
    plans: [
      { name: '單人', withStay: 4599, withoutStay: 3599 },
      { name: '盲鳥', withStay: 3999, withoutStay: 2999 },
      { name: '早鳥', withStay: 4399, withoutStay: 3399 },
      { name: '雙人', withStay: 4199, withoutStay: 3199 },
      { name: '三人', withStay: 3999, withoutStay: 2999 },
      { name: '四人', withStay: 3799, withoutStay: 2799 },
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
