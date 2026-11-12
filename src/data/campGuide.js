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

// 營隊核心學習目標：五個階段。首頁只顯示名稱，/topics/ 另顯示說明。
export const topicFlow = [
  { key: 'Develop', title: '開發服務', description: '理解 Web 架構，學習使用 Python、Flask 與 SQLite 建立 Web 服務。' },
  { key: 'Analyze', title: '分析問題', description: '透過 HTTP 請求、封包及系統 Log，理解服務運作並找出潛在漏洞。' },
  { key: 'Exploit', title: '驗證漏洞', description: '在授權的實驗環境中重現漏洞，理解攻擊原理與可能造成的影響。' },
  { key: 'Secure', title: '修補與部署', description: '修改程式、執行安全測試，並透過 Git 與 Docker 管理及部署服務。' },
  { key: 'Compete', title: '團隊攻防', description: '參與 A&D 競賽，實際進行攻擊、防守、維運及團隊協作。' },
];

// summary 給首頁卡片（一句話）；description / items / outcome 給 /topics/ 完整介紹。
export const courseTopics = [
  {
    day: 'DAY 1', title: 'Linux 與系統服務管理',
    summary: '從 Linux 操作開始，學會管理主機上的檔案、程序與服務。',
    description: '從 Linux 操作開始，認識 Web 服務運作所需的基本環境，學習如何管理主機上的檔案、程序與服務。',
    items: ['Linux 常用指令與檔案系統', '檔案權限與目錄管理', 'Process 與 Service 管理', '系統 Log 與錯誤訊息判讀', '服務啟動、停止及重啟'],
    outcome: '能夠登入自己的練習環境，找到服務程式、查看系統紀錄並完成基本維運操作。',
  },
  {
    day: 'DAY 1', title: '網路通訊與 HTTP 請求分析',
    summary: '網站的每次操作都是一筆請求，學會追蹤瀏覽器與後端之間的資料交換。',
    description: '網站上的每一次操作，背後都是一筆網路請求。透過理解 HTTP 通訊流程，學習追蹤瀏覽器與後端服務之間的資料交換。',
    items: ['IP、Port、DNS 與網路基礎', 'HTTP Request / Response', 'HTTP Method、Header 與 Cookie', 'Session 與登入驗證', 'Chrome DevTools Network', 'curl 與 Burp Suite Repeater'],
    outcome: '能夠觀察、重送及分析 HTTP 請求，並找出請求對應的後端處理流程。',
  },
  {
    day: 'DAY 1–2', title: 'Web 後端開發與服務建置',
    summary: '從開發者角度理解 Web 服務，用 Python、Flask 與 SQLite 讀懂並修改後端程式。',
    description: '從開發者的角度理解 Web 服務，學習後端程式如何接收使用者請求、處理資料及與資料庫互動，建立後續安全分析與攻防競賽所需的開發基礎。',
    items: ['Python 基礎與後端程式結構', 'Flask Web Framework', 'Routing 與 HTTP 請求處理', 'SQLite 資料庫操作', '使用者登入與資料存取', 'Web 服務功能與資料流程'],
    outcome: '理解一套 Web 服務的基本架構，能夠閱讀及修改後端程式，掌握使用者請求、資料庫與服務回應之間的關係。',
  },
  {
    day: 'DAY 1–2', title: 'Web 漏洞分析與安全修補',
    summary: '重現 IDOR 與 SQL Injection 等常見漏洞，分析成因並完成修補。',
    description: '從實際 Web 服務出發，認識常見的安全問題，學習如何重現漏洞、分析程式中的弱點，並透過修改程式碼完成安全修補。',
    items: ['Web 存取控制與權限管理', 'IDOR（Insecure Direct Object Reference）', 'SQL Injection', 'SQL 參數化查詢', '使用者身分與物件授權驗證', '漏洞重現、分析與修補', '修補前後的功能測試'],
    outcome: '能夠在授權靶場中重現指定漏洞，理解漏洞成因，並提出能保留正常功能的修補方式。',
  },
  {
    day: 'DAY 2', title: '封包分析與數位鑑識',
    summary: '攻擊發生後，從封包與 Log 還原過程、建立事件時間線。',
    description: '當攻擊事件發生時，如何還原過程並找出證據？透過網路封包與應用程式紀錄，學習追蹤攻擊行為及建立事件時間線。',
    items: ['Wireshark 操作與封包分析', 'PCAP 封包檔案判讀', 'HTTP Log 分析', '異常請求與攻擊行為追蹤', '事件時間線建立', '證據整理與影響判斷'],
    outcome: '能夠從提供的封包與 Log 中找出關鍵資訊，還原事件發生順序，並區分已確認的證據與推測。',
  },
  {
    day: 'DAY 2', title: 'Git 版本管理與服務部署',
    summary: '用 Git、Docker 與回歸測試讓修補後的服務穩定部署，必要時能復原。',
    description: '安全修補不只是修改程式碼，更需要確保服務能夠正常運作。學習透過版本管理、容器化與測試流程，讓修改後的服務能夠穩定部署及復原。',
    items: ['Git Diff、Commit 與版本管理', '團隊程式碼修改與交接', 'Docker 與 Docker Compose', 'Web 服務部署與更新', 'Regression Testing（回歸測試）', 'Health Check（健康檢查）', '服務故障排除與版本復原'],
    outcome: '能夠部署及更新自己的服務，檢查修補是否有效，並在部署失敗時恢復至先前版本。',
  },
  {
    day: 'DAY 3–4', title: 'Attack & Defense 團隊攻防競賽',
    summary: '每隊接手自己的 Web 服務，在隔離環境中攻擊其他隊伍取得 Flag，同時修補自身漏洞、維持服務運作。',
    description: '將前兩天所學的開發、漏洞分析與安全修補技術整合，進入真正的團隊攻防環境。每隊接手自己的 Web 服務，在主辦方提供的隔離環境中，透過攻擊其他隊伍的服務取得 Flag，同時分析並修補自身服務的漏洞，維持服務正常運作。',
    items: ['Attack & Defense 競賽機制', '動態 Flag 與 Checker', 'Web 漏洞利用與攻擊分析', '自有服務漏洞修補', '服務可用性與維運', '攻防策略與團隊協作', '角色輪替與任務交接'],
    outcome: '將開發、攻擊、防守及維運能力整合運用，在競賽過程中完成團隊攻防任務。',
    featured: true,
  },
  {
    day: 'DAY 3–4', title: '技術成果整理與團隊協作',
    summary: '整理攻防紀錄、修補差異與 Write-up，向其他隊伍說明自己的成果。',
    description: '除了競賽成績，也重視學員能否清楚說明自己的技術成果。透過紀錄、整理與成果發表，培養團隊合作及技術溝通能力。',
    items: ['攻防過程與操作紀錄', 'Patch 修補差異與測試結果', '事件分析與時間線報告', 'Technical Write-up 撰寫', '團隊成果分享與技術發表', 'AI 工具輔助分析與開發'],
    outcome: '完成可重現的攻防紀錄、修補成果與事件分析，並能向其他隊伍說明自己的解題過程。',
  },
];

export const learningOutcomes = [
  '操作 Linux 環境並進行基本服務管理。',
  '理解 HTTP 通訊及 Web 後端服務的運作方式。',
  '使用 Python、Flask 與 SQLite 理解及修改 Web 服務。',
  '辨識並驗證 IDOR、SQL Injection 等常見 Web 漏洞。',
  '使用 Wireshark 與 Log 分析網路事件。',
  '使用 Git、Docker 管理程式版本與服務部署。',
  '參與 A&D 團隊攻防，完成攻擊、防守及漏洞修補任務。',
  '整理技術紀錄、撰寫 Write-up 並分享團隊成果。',
];

export const teachingPoints = [
  { title: '從開發到資安，建立完整技術視野', description: '不將資安侷限於工具操作，而是從 Web 開發開始，理解系統如何運作、漏洞如何產生，以及如何從程式碼根本解決問題。' },
  { title: '從課堂到實戰，真正動手完成任務', description: '前兩天建立技術基礎，後兩天透過 A&D 競賽整合所學，讓學員親自面對實際服務中的攻防挑戰。' },
  { title: '從個人學習到團隊合作', description: '透過角色輪替、技術交接與成果分享，讓每位學員都有機會參與不同工作，而非只由少數有經驗的成員完成所有任務。' },
  { title: '允許 AI 協作，重視實際理解', description: '鼓勵使用 AI 與各種開發工具輔助程式閱讀、漏洞分析及修補，但所有成果都必須經過實際操作、測試與個人說明。' },
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
