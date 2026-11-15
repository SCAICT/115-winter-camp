// 網站圖示：npm run icons
// 從 SCAICT 標誌（public/img/LOGO/SCAICT.webp）裁出中間的「CA」貓咪圖形，輸出 PNG 版 favicon 與 apple-touch-icon。
// favicon.ico 是另外做好的，這個腳本不會動它。
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'public/img/LOGO/SCAICT.webp';
// 標誌由左至右是 S、CA（貓咪與 C、A 相連）、I、C、T；CA 位在這個水平範圍（單位：原圖像素）。
const mark = { left: 85, width: 185 };

// 先裁出水平範圍，再依透明度找出上下邊界，去掉多餘的空白。
const strip = await sharp(source).extract({ left: mark.left, top: 0, width: mark.width, height: (await sharp(source).metadata()).height }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const opaqueRows = [...Array(strip.info.height).keys()].filter((y) => {
  for (let x = 0; x < strip.info.width; x += 1) if (strip.data[(y * strip.info.width + x) * 4 + 3] > 24) return true;
  return false;
});
const top = opaqueRows[0];
const cropped = await sharp(strip.data, { raw: strip.info })
  .extract({ left: 0, top, width: strip.info.width, height: opaqueRows.at(-1) - top + 1 })
  .png()
  .toBuffer();

async function icon(size, { padding = 0, background = { r: 0, g: 0, b: 0, alpha: 0 } } = {}) {
  const inner = size - padding * 2;
  const logo = await sharp(cropped).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const outputs = {
  'public/favicon-16x16.png': await icon(16),
  'public/favicon-32x32.png': await icon(32),
  'public/favicon-48x48.png': await icon(48),
  // iOS 會把透明處塗黑，所以主動鋪上網站的深色底，並留一點邊。
  'public/apple-touch-icon.png': await icon(180, { padding: 26, background: { r: 11, g: 11, b: 11, alpha: 1 } }),
};
for (const [path, buffer] of Object.entries(outputs)) {
  await writeFile(path, buffer);
  console.log(`${path} ${buffer.length}B`);
}
