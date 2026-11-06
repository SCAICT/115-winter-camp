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
