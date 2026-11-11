# SCAICT 2027 聯合寒訓

2027 聯合寒訓官方網站。使用 Vite + React 製作。正式網址：<https://wc.scaict.org/>。

## 本機開發

```bash
npm ci
npm run dev
```

開啟 `http://localhost:5173`。執行 `npm run build` 建置，或執行 `npm run preview` 預覽。建置會透過 `scripts/build.mjs` 把 React 首頁預先產生到 `dist/index.html`，瀏覽器再接手互動；搜尋引擎不必等待 JavaScript 才能讀取正文。請使用 `npm run build` 取得完整部署產物。

建置後可執行 `npm run check:seo`，檢查實際產物的標題、摘要、可索引正文、活動結構化資料與 sitemap。

## 更新活動與售票資訊

在 `src/data/winterCamp.js` 編輯活動日期、地點與票券資料。6 種票價已列於 `ticket.plans`，所有票種皆含住宿，`price` 金額以新臺幣每位學員計；盲鳥主卡會讀取其中的盲鳥票價。三階段報名日期集中在 `ticket.registrationPeriods`，`startsOn` 與 `endsOn` 使用 `YYYY-MM-DD` 格式；盲鳥主卡的報名期間也會讀取這裡的日期。尚未確定的欄位保持 `null`，網站會顯示「待公布」；售票網址 `ticket.url` 設定後，盲鳥票區塊才會顯示購票入口，名額可填入要直接顯示的文字。

活動資訊確認後，也要檢查 `src/data/siteSeo.js` 的搜尋摘要與社群分享文案；標題、摘要、Open Graph、Twitter Card 與 JSON-LD 由 `vite.config.js` 注入首頁。日期、場地、報名階段與票價會讀取活動及課表資料，報名階段的 `plan` 對應 `ticket.plans[].name`。若正式網址變更，需同步更新 `public/CNAME`、`CNAME`、`public/sitemap.xml`、`public/robots.txt` 與 `src/data/siteSeo.js`。

## 搜尋引擎優化

首頁以「2027 寒假營隊」「冬日營」為主要搜尋用語，搭配「臺中」「高中生資訊營」說明地點與對象。相關內容分布在標題、摘要、主標題、營隊介紹及 FAQ；課程主題尚未公布時，不加入未確認的課程承諾。

`src/data/siteSeo.js` 集中管理搜尋及社群分享資訊，並產生 Organization、WebSite、EducationEvent 結構化資料。分享圖片使用歷屆活動照片，避免沿用含過期票價的圖片。活動地址依[中興大學資工系官網](https://www.cs.nchu.edu.tw/)的校園地址設定，實際場地與報到教室仍以活動資訊及課表為準。

部署後，在 [Google Search Console](https://search.google.com/search-console/) 完成網站驗證，提交 `https://wc.scaict.org/sitemap.xml`，並用「網址審查」檢查首頁、要求建立索引。可用 [Rich Results Test](https://search.google.com/test/rich-results) 檢查線上結構化資料。後續從「成效」觀察上述用語的曝光、點擊與排名，再依實際查詢調整內容；收錄與排名由搜尋引擎決定。

## 活動指南與常見問題

`src/data/campGuide.js` 集中管理四日活動概覽、報名步驟與 FAQ。課表互動參考 `115-summer-camp`，活動名稱、時段與場地採用使用者提供的「營期時間場地表.xlsx／總表」。原表日期為 2026 年，經確認採用網站本次的 2027/1/21–24；日期從 `winterCamp.dates` 的起始日產生。第二天 18:00–20:00 原表只填場地，暫顯示「活動待公布」。時間軸為 07:30–21:30，每半小時一格。

課表活動可點擊開啟詳情視窗。共用活動說明放在 `eventDetails`；個別時段可在 `dayPlans[].events[]` 補上 `description`、`location`、`speaker`、`speakerBio` 或 `link`，會覆蓋共用說明並顯示於視窗。桌機與手機使用同一份資料。

住宿生活整合在「活動資訊」內，報名流程整合在「盲鳥票」內；仍可使用 `#stay` 與 `#registration` 直接跳到對應內容。

住宿地點、房型與計程車接送資訊集中在 `winterCamp.accommodation`，票價包含項目放在 `ticket.includes`；未確認的房型維持 `null`。報名資格、設備需求、退票與轉讓辦法確認後，請同步更新 FAQ；售票入口由 `ticket.url` 控制。

## 部署

`.github/workflows/deploy-pages.yml` 在推送至 `main` 後建置並部署 GitHub Pages，也可手動觸發部署；`public/CNAME` 會進入 Vite 的 `dist` 產物。正式站使用 `wc.scaict.org`，GitHub Pages 的自訂網域也需設定為 `wc.scaict.org`。
