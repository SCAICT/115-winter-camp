import { winterCamp } from './winterCamp.js';

// 時段與場地依「營期時間場地表.xlsx／總表」；日期經確認採用本次 2027/1/21–24。
const dayPlans = [
  {
    title: '報到、課程與交流',
    events: [
      { start: '10:00', end: '11:00', title: '報到、開訓典禮', kind: 'activity', location: '414 教室' },
      { start: '11:00', end: '13:00', title: '破冰及午餐', kind: 'meal', location: '校園' },
      { start: '13:00', end: '16:30', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '16:30', end: '17:30', title: '晚餐', kind: 'meal', location: '414 教室' },
      { start: '17:30', end: '19:00', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '19:00', end: '19:30', title: '回旅館', kind: 'logistics', location: '旅館' },
      { start: '19:30', end: '21:00', title: '遊戲', kind: 'activity', location: '旅館' },
    ],
  },
  {
    title: '課程與活動',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      { start: '09:00', end: '12:30', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:30', end: '17:00', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '17:00', end: '18:00', title: '晚餐', kind: 'meal', location: '414 教室' },
      { start: '18:00', end: '20:00', title: '活動待公布', kind: 'activity', location: '北廣、應數系教室' },
      { start: '20:00', end: '21:00', title: '回旅館', kind: 'logistics', location: '旅館' },
    ],
  },
  {
    title: '課程與講座',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      { start: '09:00', end: '12:00', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '12:00', end: '13:00', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:00', end: '15:00', title: '講座', kind: 'learning', location: '414 教室' },
      { start: '15:00', end: '17:00', title: '課程', kind: 'learning', location: '821 電腦教室' },
      { start: '17:00', end: '18:00', title: '晚餐', kind: 'meal', location: '414 教室' },
      { start: '18:00', end: '21:00', title: '回旅館', kind: 'logistics', location: '旅館' },
    ],
  },
  {
    title: '黑客松與成果發表',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      { start: '09:00', end: '12:30', title: '黑客松', kind: 'project', location: '821 電腦教室' },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:30', end: '15:00', title: '成果發表', kind: 'project', location: '414 教室' },
      { start: '15:00', end: '16:00', title: '講座', kind: 'learning', location: '414 教室' },
      { start: '16:00', end: '18:00', title: '閉幕', kind: 'activity', location: '414 教室' },
    ],
  },
];

const firstDay = Date.parse(`${winterCamp.dates.split(' ~ ')[0]}T00:00:00Z`);

const eventDetails = {
  '課程': '詳細主題、講者、設備需求與準備事項將陸續公布。',
  '講座': '請依課表時段前往指定場地。講座主題與講者資訊將另行公布。',
  '黑客松': '團隊合作與實作的時段。題目、分組、成果形式及相關規則待公布。',
  '成果發表': '團隊分享營隊期間的實作成果。發表形式、順序與相關細節將另行公布。',
};

export const campSchedule = {
  source: '營期時間場地表.xlsx／總表',
  isDraft: false,
  startTime: '07:30',
  endTime: '21:30',
  days: dayPlans.map((day, index) => ({
    ...day,
    date: new Date(firstDay + index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    events: day.events.map((event) => ({
      description: eventDetails[event.title] ?? null,
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
    question: '2027 寒訓在哪裡、什麼時候舉辦？',
    answer: `活動於 2027 年 1 月 21–24 日在臺中${winterCamp.venue}舉辦，為期四天。第一天「報到、開訓典禮」的時段為 ${campSchedule.days[0].events[0].start}–${campSchedule.days[0].events[0].end}，地點為${campSchedule.days[0].events[0].location}。`,
    link: { label: '查看活動資訊', href: '#details' },
  },
  {
    id: 'eligibility',
    question: '高中生可以參加嗎？沒有程式基礎也能報名資訊營嗎？',
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
];
