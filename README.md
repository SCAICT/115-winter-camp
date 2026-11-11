# SCAICT 2027 聯合寒訓

2027 聯合寒訓官方網站。使用 Vite + React 製作。正式網址：<https://wc.scaict.org/>。

## 本機開發

```bash
npm ci
npm run dev
```

開啟 `http://localhost:5173`。執行 `npm run build` 建置，或執行 `npm run preview` 預覽。

## 更新活動與售票資訊

在 `src/data/winterCamp.js` 編輯活動日期、地點與票券資料。6 種票價已列於 `ticket.plans`，所有票種皆含住宿，`price` 金額以新臺幣每位學員計；盲鳥主卡會讀取其中的盲鳥票價。三階段報名日期集中在 `ticket.registrationPeriods`，`startsOn` 與 `endsOn` 使用 `YYYY-MM-DD` 格式；盲鳥主卡的報名期間也會讀取這裡的日期。尚未確定的欄位保持 `null`，網站會顯示「待公布」；售票網址 `ticket.url` 設定後，盲鳥票區塊才會顯示購票入口，名額可填入要直接顯示的文字。

活動資訊確認後，也要同步更新 `index.html` 的社群分享文案；若正式網址變更，需同步更新 `public/CNAME`、`CNAME`、`public/sitemap.xml`、`public/robots.txt` 與 `index.html`。

## 活動指南與常見問題

`src/data/campGuide.js` 集中管理四日活動概覽、報名步驟與 FAQ。課表參考 `115-summer-camp` 的四日時間軸與手機單日切換方式，目前使用預排資料；正式安排確認後再更新時段及活動。日期從 `winterCamp.dates` 的起始日產生。

課表活動可點擊開啟詳情視窗。共用活動說明放在 `eventDetails`；個別時段可在 `dayPlans[].events[]` 補上 `description`、`location`、`speaker`、`speakerBio` 或 `link`，會覆蓋共用說明並顯示於視窗。桌機與手機使用同一份資料。

住宿生活整合在「活動資訊」內，報名流程整合在「盲鳥票」內；仍可使用 `#stay` 與 `#registration` 直接跳到對應內容。

住宿地點、房型與計程車接送資訊集中在 `winterCamp.accommodation`，票價包含項目放在 `ticket.includes`；未確認的房型維持 `null`。報名資格、設備需求、退票與轉讓辦法確認後，請同步更新 FAQ；售票入口由 `ticket.url` 控制。

## 部署

`.github/workflows/deploy-pages.yml` 在推送至 `main` 後建置並部署 GitHub Pages，也可手動觸發部署；`public/CNAME` 會進入 Vite 的 `dist` 產物。正式站使用 `wc.scaict.org`，GitHub Pages 的自訂網域也需設定為 `wc.scaict.org`。
