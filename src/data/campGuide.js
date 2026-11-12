import { winterCamp } from './winterCamp.js';

// 時段與場地依「營期時間場地表.xlsx／總表」；日期經確認採用本次 2027/1/21–24。
const dayPlans = [
  {
    title: '報到、Web 基礎與交流',
    events: [
      { start: '10:00', end: '11:00', title: '報到、開訓典禮', kind: 'activity', location: '414 教室' },
      { start: '11:00', end: '13:00', title: '破冰及午餐', kind: 'meal', location: '校園' },
      {
        start: '13:00', end: '16:30', title: '課程：Linux 與 HTTP', kind: 'learning', location: '821 電腦教室',
        description: '先確認連線與練習環境，再學習 Linux 檔案、權限、程序、服務與 Log；接著認識 IP、Port、DNS 及 HTTP 請求、回應與 Cookie，並用 DevTools、curl 與 Burp Repeater 重送請求、追蹤資料流。最後補充 Python 基礎，帶你看懂後端程式。中間安排短休息。',
      },
      { start: '16:30', end: '17:30', title: '晚餐', kind: 'meal', location: '414 教室' },
      {
        start: '17:30', end: '19:00', title: '課程：登入驗證與越權', kind: 'learning', location: '821 電腦教室',
        description: '從路由、登入驗證與物件授權出發，找出程式在哪裡檢查登入、哪裡檢查資料擁有者；再透過引導實作重現 IDOR（越權讀取）問題、動手修補，並完成個人驗收：本人可讀取，其他帳號無法越權。',
      },
      { start: '19:00', end: '19:30', title: '回旅館', kind: 'logistics', location: '旅館' },
      { start: '19:30', end: '21:00', title: '遊戲', kind: 'activity', location: '旅館' },
    ],
  },
  {
    title: '分析、修補與模擬賽',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      {
        start: '09:00', end: '12:30', title: '課程：SQLi、封包與 Git', kind: 'learning', location: '821 電腦教室',
        description: '學習 SQL Injection、基本查詢與參數化修補；用 Wireshark 與 HTTP Log 還原事件時間線；再以 Git 管理 diff、commit 與交接，並練習用 Docker Compose 啟動與更新自己的服務。中間安排短休息。',
      },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:30', end: '14:00', title: '講座', kind: 'learning', location: '414 教室' },
      {
        start: '14:00', end: '17:00', title: '課程：測試復原與模擬賽', kind: 'learning', location: '821 電腦教室',
        description: '學習回歸測試、健康檢查與失敗復原，用 Python 把手動測試整理成可重複的腳本；了解 Attack/Defense 規則、動態 Flag、Checker 與計分後，進行不計排名的 Mini 攻防，在角色輪替中各走一次修補、部署與故障處理。中間安排短休息。',
      },
      { start: '17:00', end: '18:00', title: '晚餐', kind: 'meal', location: '414 教室' },
      { start: '18:00', end: '20:00', title: '活動待公布', kind: 'activity', location: '北廣、應數系教室' },
      { start: '20:00', end: '21:00', title: '回旅館', kind: 'logistics', location: '旅館' },
    ],
  },
  {
    title: '攻防競賽與講座',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      { start: '09:00', end: '12:00', title: '攻防競賽（上午）', kind: 'project', location: '821 電腦教室' },
      { start: '12:00', end: '13:00', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:00', end: '15:00', title: '講座', kind: 'learning', location: '414 教室' },
      { start: '15:00', end: '17:00', title: '攻防競賽（下午）', kind: 'project', location: '821 電腦教室' },
      { start: '17:00', end: '18:00', title: '晚餐', kind: 'meal', location: '414 教室' },
      { start: '18:00', end: '21:00', title: '回旅館', kind: 'logistics', location: '旅館' },
    ],
  },
  {
    title: '攻防收尾與成果發表',
    events: [
      { start: '07:30', end: '08:00', title: '起床', kind: 'logistics', location: '旅館' },
      { start: '09:00', end: '12:00', title: '攻防競賽（最終回）', kind: 'project', location: '821 電腦教室' },
      { start: '12:30', end: '13:30', title: '午餐', kind: 'meal', location: '414 教室' },
      { start: '13:30', end: '14:40', title: '成果發表', kind: 'project', location: '414 教室' },
      { start: '15:00', end: '16:00', title: '講座', kind: 'learning', location: '414 教室' },
      { start: '16:00', end: '18:00', title: '閉幕', kind: 'activity', location: '414 教室' },
    ],
  },
];

const firstDay = Date.parse(`${winterCamp.dates.split(' ~ ')[0]}T00:00:00Z`);

const competitionDescription = '各隊接手相同的 Web 服務，在主辦提供的隔離環境內，一邊攻擊其他隊伍、一邊修補並維持自己的服務。每五分鐘為一回合，需要同時兼顧找漏洞、提交證據、修補測試與服務可用。競賽時段以外的用餐、講座、移動與夜間，環境一律暫停。詳細規則與計分方式將於賽前公布。';

const eventDetails = {
  '講座': '請依課表時段前往指定場地。講座主題與講者資訊將另行公布。',
  '攻防競賽（上午）': competitionDescription,
  '攻防競賽（下午）': competitionDescription,
  '攻防競賽（最終回）': `${competitionDescription}最後 15 分鐘為提交修補紀錄與收尾時間。`,
  '成果發表': '10 隊依序上台，每隊分享一個代表事件：怎麼找到、怎麼修補、如何驗證。每隊 4 分鐘分享，另有 3 分鐘問答。',
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

export const topicFlow = ['看懂服務', '驗證問題', '找到證據', '修改程式', '測試部署'];

export const courseTopics = [
  {
    day: 'DAY 1', title: 'Linux 與服務環境',
    description: '先學會在主機上「找東西」：服務程式放在哪、設定在哪、錯誤訊息去哪裡看。',
    outcome: '登入自己的練習環境，找到服務檔案、查看 Log，並重啟指定服務。',
    tags: ['檔案與權限', '程序與服務', 'Log'],
  },
  {
    day: 'DAY 1', title: 'HTTP 與請求分析',
    description: '網站的每個動作都是一筆請求。看懂請求與回應，就能知道後端到底做了什麼。',
    outcome: '指出一筆請求的路徑、方法、Cookie 與參數，用 curl 或 Burp 重送並對應到後端路由。',
    tags: ['IP / Port / DNS', 'Cookie', 'DevTools', 'curl', 'Burp'],
  },
  {
    day: 'DAY 1–2', title: 'Web 漏洞驗證與修補',
    description: '聚焦兩種最常見的問題：存取控制錯誤（越權）與 SQL Injection，在授權靶場親手重現、再親手修好。',
    outcome: '說明資料如何被不當取得，提交修補並證明攻擊失效、正常功能仍可用。',
    tags: ['IDOR', 'SQL Injection', '參數化查詢'],
  },
  {
    day: 'DAY 2', title: '封包與 Log 事件還原',
    description: '攻擊發生之後，還原現場。從封包與應用程式 Log 排出時間線，分清楚事實與推測。',
    outcome: '指出事件的時間、路徑、證據與影響，並寫出一份有憑有據的事件紀錄。',
    tags: ['Wireshark', 'HTTP Log', '時間線'],
  },
  {
    day: 'DAY 2', title: 'Git、測試與部署',
    description: '修補不只是改程式。學會留下可讀的差異、跑回歸測試，讓隊友能接手，也能在出錯時退回上一版。',
    outcome: '用 Git 交接修補，並用 Docker Compose 啟動、更新與復原自己的服務。',
    tags: ['Git', '回歸測試', 'Docker Compose', 'Python 腳本'],
  },
  {
    day: 'DAY 3–4', title: '團隊攻防競賽',
    description: '把前兩天學的全部用上。每隊接手同一套 Web 服務，攻擊其他隊伍、修補自己的服務，並讓正常使用者繼續操作。',
    outcome: '在角色輪替中走完分析、修補、維運與紀錄，留下可重現的攻防紀錄與 Write-up。',
    tags: ['Attack / Defense', '動態 Flag', '角色輪替'],
    featured: true,
  },
];

export const teachingPoints = [
  { title: '操作優先', description: '每個單元以短講、示範、實作、同伴說明進行，上機操作至少占一半時間。' },
  { title: '新手友善', description: '練習分為保底任務與延伸任務，保底任務提供分階段提示，進階隊伍有額外挑戰。' },
  { title: '每人都動手', description: '全班共用同一套服務與語言，並提供行前教材與指令小抄，助教巡迴協助。' },
];
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
    answer: `活動於 2027 年 1 月 21–24 日在臺中的${winterCamp.venue}舉辦，為期四天。第一天「報到、開訓典禮」的時段為 ${campSchedule.days[0].events[0].start}–${campSchedule.days[0].events[0].end}，地點為${campSchedule.days[0].events[0].location}。`,
    link: { label: '查看活動資訊', href: '#details' },
  },
  {
    id: 'eligibility',
    question: '高中生可以參加嗎？沒有程式基礎也能報名資訊營嗎？',
    answer: '活動以高中生為主，程度不限，沒有程式基礎、沒玩過 CTF 的初學者也歡迎報名參加！建議具備變數、條件判斷與函式的基本概念，我們會提供行前教材協助銜接。',
    link: { label: '詢問主辦單位', href: `mailto:${winterCamp.email}` },
  },
  {
    id: 'content',
    question: '營隊會學什麼？',
    answer: '本次聚焦 Web 攻防。前兩天以實作課學習 Linux、HTTP、越權與 SQL Injection、封包與 Log 分析、Git、修補與部署；後兩天組隊進行攻防競賽，找出漏洞、修好自己的服務，並讓正常功能持續可用。',
    link: { label: '查看四天課表', href: '/topics/#schedule' },
  },
  {
    id: 'competition',
    question: '攻防競賽是怎麼進行的？',
    answer: '各隊接手相同的 Web 服務，在主辦提供的隔離環境內攻擊其他隊伍、修補自己的服務。只允許攻擊公告的範圍，競賽僅在課表上的競賽時段進行；用餐、講座、移動與夜間環境都會暫停。詳細規則與計分方式將於賽前公布。',
    link: { label: '查看課表', href: '/topics/#schedule' },
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
