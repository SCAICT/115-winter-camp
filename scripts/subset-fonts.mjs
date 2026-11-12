// 依網站實際用到的文字，把完整的 LINE Seed TW 字型（各約 3.4MB）縮成子集（各約 240KB）。
// 建置時會自動執行，所以修改文案後不需要手動處理；沒收錄到的字會退回系統字型。
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { transform } from 'esbuild';
import subsetFont from 'subset-font';

const root = new URL('../', import.meta.url);
const outDir = new URL('src/fonts/subset/', root);
const fonts = [
  ['LINESeedTW-Rg.woff2', 'src/fonts/LINESeedTW_OTF_Rg.woff2'],
  ['LINESeedTW-Bd.woff2', 'src/fonts/LINESeedTW_OTF_Bd.woff2'],
];

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.(jsx?|css)$/.test(entry.name)) files.push(path);
  }
  return files;
}

// 程式碼與 CSS 的註解不會顯示在畫面上，先去掉，避免把註解裡的字也收進字型。
async function visibleText(file) {
  const code = await readFile(file, 'utf8');
  if (file.endsWith('.css')) return code.replace(/\/\*[\s\S]*?\*\//g, '');
  // charset: 'utf8'：esbuild 預設會把非 ASCII 字元轉成 \uXXXX，文字就看不見了。
  const { code: stripped } = await transform(code, { loader: 'jsx', jsx: 'preserve', legalComments: 'none', charset: 'utf8' });
  return stripped;
}

// 網站會用到的全部字元（測試也用它來確認預先渲染出來的文字都有被收進字型）。
export async function collectCharset() {
  let text = await readFile(new URL('index.html', root), 'utf8');
  for (const file of await walk(fileURLToPath(new URL('src', root)))) text += await visibleText(file);
  // ASCII 全收；星期（Intl 於執行時產生，原始碼裡沒有）與常用全形標點另外補上。
  const ascii = Array.from({ length: 95 }, (_, index) => String.fromCharCode(32 + index)).join('');
  const extras = '週一二三四五六日，。、；：「」『』（）？！…—～·–→↗↑←';
  return new Set([...(text + ascii + extras)].filter((char) => !/[\r\n\t]/.test(char)));
}

async function main() {
  const charset = [...await collectCharset()].join('');
  await mkdir(outDir, { recursive: true });
  let total = 0;
  for (const [name, source] of fonts) {
    const original = await readFile(new URL(source, root));
    const subset = await subsetFont(original, charset, { targetFormat: 'woff2' });
    await writeFile(new URL(name, outDir), subset);
    total += subset.length;
    console.log(`${name}: ${(original.length / 1024).toFixed(0)}KB -> ${(subset.length / 1024).toFixed(0)}KB`);
  }
  console.log(`Font subset: ${[...charset].length} characters, ${(total / 1024).toFixed(0)}KB total.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
