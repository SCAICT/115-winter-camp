# SCAICT 2027 聯合寒訓

2027 聯合寒訓盲鳥票預告網站，使用 Vite + React 製作。正式網址：<https://wc.scaict.org/>。

## 本機開發

```bash
npm ci
npm run dev
```

開啟 `http://localhost:5173`。執行 `npm run build` 建置，或執行 `npm run preview` 預覽。

## 更新活動與售票資訊

在 `src/data/winterCamp.js` 編輯活動日期、地點與票券資料。6 種票價已列於 `ticket.plans`，所有票種皆含住宿，`price` 金額以新臺幣每位學員計；盲鳥主卡會讀取其中的盲鳥票價。三階段報名日期集中在 `ticket.registrationPeriods`，`startsOn` 與 `endsOn` 使用 `YYYY-MM-DD` 格式；盲鳥主卡的報名期間也會讀取這裡的日期。尚未確定的欄位保持 `null`，網站會顯示「待公布」；售票網址 `ticket.url` 設定後，盲鳥票區塊才會顯示購票入口，名額可填入要直接顯示的文字。

活動資訊確認後，也要同步更新 `index.html` 的社群分享文案；若正式網址變更，需同步更新 `public/CNAME`、`CNAME`、`public/sitemap.xml`、`public/robots.txt` 與 `index.html`。

## 部署

`.github/workflows/deploy-pages.yml` 在推送至 `main` 後建置並部署 GitHub Pages；`public/CNAME` 會進入 Vite 的 `dist` 產物。開發站使用 `wcdev.scaict.org`。
