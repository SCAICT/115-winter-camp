import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { build, createServer } from 'vite';
import { subpages } from '../src/data/siteSeo.js';

await build();

const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const placeholder = '<div id="root"></div>';

// 子頁沿用同一份建置後的範本，只替換標題、摘要、canonical 與社群分享資訊。
function withPageSeo(html, { title, description, url }) {
  const replaceOnce = (pattern, replacement) => {
    if (!pattern.test(html)) throw new Error(`Cannot find ${pattern} in the built template.`);
    html = html.replace(pattern, (_match, before = '', after = '') => `${before}${replacement}${after}`);
  };
  replaceOnce(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  replaceOnce(/(<meta name="description" content=")[^"]*(")/, escapeAttribute(description));
  replaceOnce(/(<link rel="canonical" href=")[^"]*(")/, url);
  replaceOnce(/(<meta property="og:url" content=")[^"]*(")/, url);
  for (const [attribute, key, value] of [
    ['property', 'og:title', title], ['property', 'og:description', description],
    ['name', 'twitter:title', title], ['name', 'twitter:description', description],
  ]) {
    replaceOnce(new RegExp(`(<meta ${attribute}="${key}" content=")[^"]*(")`), escapeAttribute(value));
  }
  return html;
}

// Use Vite's JSX/module loader to render the same pages as the browser.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  const indexPath = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(indexPath, 'utf8');
  if (!template.includes(placeholder)) throw new Error('Cannot find the homepage prerender placeholder.');

  await writeFile(indexPath, template.replace(placeholder, () => `<div id="root">${render('/')}</div>`));
  console.log('Prerendered homepage content into dist/index.html.');

  for (const page of subpages) {
    const pageDir = new URL(`../dist${page.path}`, import.meta.url);
    await mkdir(pageDir, { recursive: true });
    const pageHtml = withPageSeo(template, page).replace(placeholder, () => `<div id="root">${render(page.path)}</div>`);
    await writeFile(new URL('index.html', pageDir), pageHtml);
    console.log(`Prerendered ${page.path} into dist${page.path}index.html.`);
  }} finally {
  await server.close();
}
