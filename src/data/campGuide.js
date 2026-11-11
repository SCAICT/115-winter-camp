import { winterCamp } from './winterCamp';

// 參考 115-summer-camp 的活動節奏；這是預排，不是已確認的寒訓課表。
const dayPlans = [
  {
    title: '報到與認識夥伴',
    events: [
      { start: '10:00', end: '11:00', title: '報到與開訓', kind: 'activity' },
      { start: '11:00', end: '13:00', title: '破冰與午餐', kind: 'meal' },
      { start: '13:00', end: '16:30', title: '學習與實作', kind: 'learning' },
      { start: '16:30', end: '18:00', title: '團隊活動', kind: 'activity' },
      { start: '18:00', end: '19:00', title: '晚餐', kind: 'meal' },
      { start: '19:00', end: '20:30', title: '晚間交流', kind: 'activity' },
    ],
  },
  {
    title: '學習與交流',
    events: [
      { start: '08:00', end: '09:00', title: '早餐', kind: 'meal' },
      { start: '09:00', end: '12:30', title: '學習與實作', kind: 'learning' },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal' },
      { start: '13:30', end: '16:30', title: '學習與實作', kind: 'learning' },
      { start: '16:30', end: '18:00', title: '主題交流', kind: 'activity' },
      { start: '18:00', end: '19:00', title: '晚餐', kind: 'meal' },
      { start: '19:00', end: '21:00', title: '晚間活動', kind: 'activity' },
    ],
  },
  {
    title: '實作與團隊合作',
    events: [
      { start: '08:00', end: '09:00', title: '早餐', kind: 'meal' },
      { start: '09:00', end: '12:00', title: '學習與實作', kind: 'learning' },
      { start: '12:00', end: '13:00', title: '午餐', kind: 'meal' },
      { start: '13:00', end: '15:00', title: '主題交流', kind: 'activity' },
      { start: '15:00', end: '17:00', title: '學習與實作', kind: 'learning' },
      { start: '17:00', end: '18:00', title: '晚餐', kind: 'meal' },
      { start: '18:00', end: '21:00', title: '團隊實作', kind: 'project' },
    ],
  },
  {
    title: '成果分享與賦歸',
    events: [
      { start: '08:00', end: '09:00', title: '早餐', kind: 'meal' },
      { start: '09:00', end: '12:30', title: '團隊實作', kind: 'project' },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal' },
      { start: '13:30', end: '15:00', title: '成果分享', kind: 'project' },
      { start: '15:00', end: '16:00', title: '交流與回顧', kind: 'activity' },
      { start: '16:00', end: '17:00', title: '閉幕與賦歸', kind: 'activity' },
    ],
  },
];

const firstDay = Date.parse(`${winterCamp.dates.split(' ~ ')[0]}T00:00:00Z`);

const eventDetails = {
  '報到與開訓': '完成報到、認識營隊與四天的活動安排。確切報到位置、應備資料與集合方式將另行公布。',
  '破冰與午餐': '透過破冰活動認識一起參與寒訓的夥伴，接著安排午餐。活動方式與餐食細節將另行公布。',
  '學習與實作': '以學習與動手實作為主的時段。詳細主題、講者、設備需求與準備事項將隨正式課表公布。',
  '團隊活動': '與同伴一起參與團隊活動，認識彼此並練習合作。活動內容與分組方式待公布。',
  '晚間交流': '預留給夥伴交流、分享想法的晚間時段，實際進行方式將另行公布。',
  '主題交流': '圍繞主題進行分享與討論。主題、講者與活動形式待公布。',
  '晚間活動': '預排的晚間活動時段，內容與集合方式將另行公布。',
  '團隊實作': '團隊合作與實作的時段。題目、分組、成果形式及相關規則待公布。',
  '成果分享': '預留給團隊整理與分享成果，實際發表形式、順序與地點待公布。',
  '交流與回顧': '回顧四天的參與經驗，與夥伴交流、分享收穫。實際安排將另行公布。',
  '閉幕與賦歸': '營隊收尾與賦歸時段。確切結束時間、解散地點與返程注意事項將於行前資訊中公布。',
};
const mealDescription = '本次費用已包含餐食，供餐方式、用餐地點與菜單細節待公布。如有素食、過敏或其他飲食需求，報名前請先聯繫主辦單位確認。';

export const campSchedule = {
  isDraft: true,
  startTime: '08:00',
  endTime: '21:00',
  days: dayPlans.map((day, index) => ({
    ...day,
    date: new Date(firstDay + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    events: day.events.map((event) => ({
      description: eventDetails[event.title] ?? (event.kind === 'meal' ? mealDescription : null),
      ...event,
    })),
  })),
};

export const registrationSteps = [
  { title: '確認票種與時程', description: '先查看票價、費用包含項目與報名期間，選擇適合自己的報名階段。' },
  { title: '填寫報名資料', description: '售票表單開放後，依頁面指示填寫聯絡方式與相關資料，送出前再次確認。' },
  { title: '確認付款與狀態', description: '依售票表單公布的繳費方式與期限操作，保留報名及付款紀錄。' },
  { title: '查看行前資訊', description: '留意官方公告與報名時留下的聯絡管道，確認集合資訊與攜帶物品。' },
];

export const campFaqs = [
  {
    id: 'dates-venue',
    question: '活動在哪裡、什麼時候舉辦？',
    answer: `活動於 2027 年 1 月 21–24 日在${winterCamp.venue}舉辦。詳細報到時間與集合地點將另行公布。`,
    link: { label: '查看活動資訊', href: '#details' },
  },
  {
    id: 'eligibility',
    question: '誰可以參加？沒有程式基礎也能報名嗎？',
    answer: '活動以高中生為主，程度不限，沒有程式基礎的初學者也歡迎報名參加！',
    link: { label: '詢問主辦單位', href: `mailto:${winterCamp.email}` },
  },
  {
    id: 'equipment',
    question: '需要自備筆電嗎？',
    answer: '我們會提供電腦教室，不一定要自備筆電。如果有自己的筆電，也鼓勵帶來使用！',
  },
  {
    id: 'included',
    question: '報名費包含哪些項目？',
    answer: `本次票價包含${winterCamp.ticket.includes.join('、')}，金額以每位學員計。各票種價格與報名期間可在票價區塊查看。`,
    link: { label: '查看票價與報名時程', href: '#ticket' },
  },
  {
    id: 'stay-meals',
    question: '住宿、餐食與交通怎麼安排？',
    answer: `住宿地點為${winterCamp.accommodation.name}，住宿與餐食已包含在票價內。${winterCamp.accommodation.transfer}房型、分房方式與餐食細節待公布；如有飲食過敏或其他需求，報名前請先聯繫主辦單位確認。`,
    link: { label: '查看住宿與生活資訊', href: '#stay' },
  },
  {
    id: 'registration',
    question: '要如何報名？',
    answer: winterCamp.ticket.url
      ? '請透過官方售票表單填寫資料，並依頁面指示完成報名與繳費。操作步驟可參考下方連結。'
      : '正式售票入口尚未公布。可以先查看報名時程，並追蹤 SCAICT Instagram 的開賣消息。',
    link: { label: '查看報名流程', href: '#registration' },
  },
  {
    id: 'changes',
    question: '可以退票、轉讓或修改報名資料嗎？',
    answer: '退票、轉讓與資料修改規則尚待公布，請以正式售票表單的報名辦法為準。已有報名相關問題時，請附上必要的報名資訊聯繫主辦單位。',
    link: { label: 'Email 聯繫', href: `mailto:${winterCamp.email}` },
  },
];
