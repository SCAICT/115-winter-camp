// 圖片優化：npm run images（需要 sharp；產出的檔案一併提交，建置時不會執行）。
//  1. 照片牆：照片在畫面上最大約 360px，產生 360／720px 寬兩種縮圖（原圖保留當作來源，og:image 也還在用）。
//  2. 民宿照片：JPG 轉成 WebP。
//  3. Logo：畫面上最多約 240×80，把過大的圖縮到合理尺寸（有的原檔高達 9109×8000，解碼會吃掉上百 MB 記憶體）。
// 專案裡許多檔案是 JPEG／PNG 內容卻用 .webp 副檔名，這裡一律輸出真正的 WebP。
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const img = 'public/img';
const kb = (bytes) => `${(bytes / 1024).toFixed(0)}KB`;

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    // 一律用 / 當分隔符號：Windows 的 join() 會產生 \，後面用字串取代來推算輸出路徑時就會比對不到，
    // 結果把來源原圖覆蓋掉。
    const path = join(dir, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

async function write(path, buffer) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
}

const report = [];

// 1. 照片牆縮圖：360px（小格子）與 720px（大格子、2 倍螢幕）兩種寬度，PhotoWall 以 srcset 讓瀏覽器挑選。
const wallWidths = [360, 720];
await rm(`${img}/wall`, { recursive: true, force: true });
for (const [sourceDir, targetDir] of [[`${img}/gallery-optimized`, `${img}/wall/gallery`], [`${img}/photos-optimized`, `${img}/wall/photos`]]) {
  for (const file of (await walk(sourceDir)).filter((path) => path.endsWith('.webp'))) {
    const before = (await stat(file)).size;
    const input = await readFile(file);
    for (const width of wallWidths) {
      const target = file.replace(sourceDir, targetDir).replace(/\.webp$/, `-${width}.webp`);
      if (target === file) throw new Error(`Refusing to overwrite the source image: ${file}`);
      const output = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: width > 400 ? 70 : 68, effort: 5 }).toBuffer();
      await write(target, output);
      report.push({ file: target.replace(`${img}/`, ''), before, after: output.length });
    }
  }
}

// 2. 民宿照片：JPG → WebP
for (const file of (await readdir(img)).filter((name) => /^loosha-.*\.jpg$/.test(name))) {
  const source = `${img}/${file}`;
  const before = (await stat(source)).size;
  const output = await sharp(await readFile(source)).webp({ quality: 74, effort: 5 }).toBuffer();
  await write(source.replace(/\.jpg$/, '.webp'), output);
  report.push({ file: file.replace(/\.jpg$/, '.webp'), before, after: output.length });
}

// 3. Logo：只處理過大的檔案（已縮小的不會重複壓縮）。
const logoLimits = {
  // 顯示尺寸約 240×80（導覽列／頁尾約 85–160px 寬），預留 2 倍螢幕密度。
  default: { width: 480, height: 240 },
  'white_logo_nobg.webp': { width: 800, height: 400 },
};
for (const file of (await readdir(`${img}/LOGO`)).filter((name) => /\.(webp|png)$/.test(name))) {
  const path = `${img}/LOGO/${file}`;
  const limit = logoLimits[file] ?? logoLimits.default;
  const input = await readFile(path);
  const meta = await sharp(input).metadata();
  const oversized = meta.width > limit.width * 1.25 || meta.height > limit.height * 1.25;
  const fakeWebp = file.endsWith('.webp') && meta.format !== 'webp';
  if (!oversized && !fakeWebp) continue;
  const output = await sharp(input)
    .resize({ width: limit.width, height: limit.height, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toBuffer();
  if (output.length >= input.length && !fakeWebp) continue;
  await write(path, output);
  report.push({ file: `LOGO/${file} (${meta.width}x${meta.height} -> ${(await sharp(output).metadata()).width}x${(await sharp(output).metadata()).height})`, before: input.length, after: output.length });
}

let before = 0;
let after = 0;
for (const row of report) {
  before += row.before;
  after += row.after;
  console.log(`${kb(row.before).padStart(7)} -> ${kb(row.after).padStart(6)}  ${row.file}`);
}
console.log(`\n${report.length} files: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
