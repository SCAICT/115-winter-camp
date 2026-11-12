import assert from 'node:assert/strict';
import { readFile, readdir, stat, access } from 'node:fs/promises';
import test from 'node:test';
import { siteSeo, topicsSeo, aboutSeo, subpages } from '../src/data/siteSeo.js';
import { courseTopics, learningOutcomes, teachingPoints } from '../src/data/campGuide.js';
import { winterCamp } from '../src/data/winterCamp.js';
import { collectCharset } from '../scripts/subset-fonts.mjs';
import { campSchedule } from '../src/data/campGuide.js';

// Check the deployable artifact, rather than only the source configuration.
const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] ?? '';
const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

test('built HTML includes one consistent title, description and canonical URL', () => {
  assert.equal([...html.matchAll(/<title>/g)].length, 1);
  assert.ok(html.includes(`<title>${siteSeo.title}</title>`));
  assert.equal([...html.matchAll(/name="description"/g)].length, 1);
  assert.ok(html.includes(`name="description" content="${siteSeo.description}"`));
  assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1);
  assert.ok(html.includes(`rel="canonical" href="${siteSeo.url}"`));
  assert.ok(!html.includes('noindex'));
  for (const key of ['og:title', 'og:description', 'og:image', 'twitter:title', 'twitter:description', 'twitter:image']) {
    assert.ok(html.includes(`="${key}"`), key);
  }
});

test('homepage content and useful search terms exist before JavaScript runs', () => {
  assert.equal([...main.matchAll(/<h1\b/g)].length, 1);
  for (const text of ['2027', '寒假', '營隊', '高中生', '臺中', winterCamp.venue, '攻防', '漏洞', '沒有程式基礎']) {
    assert.ok(main.includes(text), `Missing prerendered content: ${text}`);
  }
  for (const section of ['topics', 'about', 'details', 'ticket', 'faq']) {
    assert.ok(main.includes(`id="${section}"`), section);
  }
  assert.ok(!main.includes('id="schedule"'), 'The full schedule belongs on the topics subpage');
  // Registration state is calculated in the browser, not frozen on the build date.
  assert.equal([...main.matchAll(/data-registration-status="scheduled"/g)].length, winterCamp.ticket.registrationPeriods.length);
  assert.ok(!main.includes('本次報名已結束。'));
  assert.ok(html.includes('<noscript>'));
});

test('event JSON-LD matches the published schedule, venue and visible ticket prices', () => {
  assert.equal(jsonLd.length, 1);
  const data = JSON.parse(jsonLd[0][1]);
  const event = data['@graph'].find((item) => item['@type'] === 'EducationEvent');
  const organization = data['@graph'].find((item) => item['@type'] === 'Organization');
  const [start, end] = winterCamp.dates.split(' ~ ');
  assert.equal(event.startDate, `${start}T${campSchedule.days[0].events[0].start}:00+08:00`);
  assert.equal(event.endDate, `${end}T${campSchedule.days.at(-1).events.at(-1).end}:00+08:00`);
  assert.equal(event.name, winterCamp.name);
  assert.equal(event.url, siteSeo.url);
  assert.equal(event.location.name, winterCamp.venue);
  assert.deepEqual(event.location.address, {
    '@type': 'PostalAddress',
    ...winterCamp.venueAddress,
  });
  assert.equal(event.organizer['@id'], organization['@id']);
  assert.equal(event.offers.length, winterCamp.ticket.registrationPeriods.length);
  for (const [index, period] of winterCamp.ticket.registrationPeriods.entries()) {
    const offer = event.offers[index];
    const plan = winterCamp.ticket.plans.find(({ name }) => name === period.plan);
    assert.equal(offer.price, plan.price);
    assert.equal(offer.priceCurrency, 'TWD');
    assert.equal(offer.url, winterCamp.ticket.url);
    assert.equal(offer.validFrom, `${period.startsOn}T00:00:00+08:00`);
    assert.equal(offer.validThrough, `${period.endsOn}T23:59:59+08:00`);
    assert.ok(main.includes(`$${plan.price.toLocaleString('en-US')}`));
    assert.ok(main.includes(period.startsOn.replaceAll('-', '/')));
    assert.ok(main.includes(period.endsOn.replaceAll('-', '/')));
  }
});

test('sitemap, robots and the social preview image are present in the deployable output', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8');
  const robots = await readFile(new URL('robots.txt', dist), 'utf8');
  assert.ok(sitemap.includes(`<loc>${siteSeo.url}</loc>`));
  assert.ok(robots.includes('Allow: /'));
  assert.ok(robots.includes(`Sitemap: ${siteSeo.url}sitemap.xml`));
  assert.ok(!robots.includes('Disallow: /\n'));
  const image = new URL(siteSeo.image);
  assert.equal(image.origin, new URL(siteSeo.url).origin);
  await access(new URL(`.${image.pathname}`, dist));
});

test('homepage links to each subpage, and every subpage is prerendered with its own metadata', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8');
  for (const page of subpages) {
    assert.ok(main.includes(`href="${page.path}"`), `Homepage should link to ${page.path}`);
    const html = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.ok(html.includes(`name="description" content="${page.description}"`));
    assert.ok(html.includes(`rel="canonical" href="${page.url}"`));
    assert.ok(html.includes(`property="og:url" content="${page.url}"`));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.ok(sitemap.includes(`<loc>${page.url}</loc>`));
  }
});

test('every built page is a single well-formed document with one set of head tags', async () => {
  for (const page of [{ path: '/' }, ...subpages]) {
    const html = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    const count = (pattern) => [...html.matchAll(pattern)].length;
    assert.equal(count(/<!doctype html>/gi), 1, `${page.path}: doctype`);
    assert.equal(count(/<title>/g), 1, `${page.path}: title`);
    assert.equal(count(/name="description"/g), 1, `${page.path}: description`);
    assert.equal(count(/rel="canonical"/g), 1, `${page.path}: canonical`);
    assert.equal(count(/property="og:url"/g), 1, `${page.path}: og:url`);
    assert.equal(count(/id="root"/g), 1, `${page.path}: root`);
    assert.equal(count(/type="application\/ld\+json"/g), 1, `${page.path}: JSON-LD`);
    assert.match(html, /<body>\s*<div id="root">/, `${page.path}: stray text before the app root`);
  }
});

test('subpages carry the detailed content that the homepage only summarises', async () => {
  const topics = await readFile(new URL(`.${topicsSeo.path}index.html`, dist), 'utf8');
  // 主題文字含 "&"（例如 Attack & Defense），輸出的 HTML 會是 &amp;，比對前先跳脫。
  const html = (text) => text.replaceAll('&', '&amp;');
  for (const { title, description, items, outcome } of courseTopics) {
    assert.ok(topics.includes(html(title)), `Missing topic title: ${title}`);
    assert.ok(topics.includes(html(description)), `Missing topic description: ${title}`);
    assert.ok(topics.includes(html(outcome)), `Missing topic outcome: ${title}`);
    for (const item of items) assert.ok(topics.includes(html(item)), `Missing topic item: ${item}`);
  }
  for (const text of learningOutcomes) assert.ok(topics.includes(html(text)), `Missing learning outcome: ${text}`);
  for (const { title } of teachingPoints) assert.ok(topics.includes(title), `Missing teaching point: ${title}`);
  // 首頁只放摘要，不重複放完整的課程內容清單。
  assert.ok(!main.includes(html(courseTopics[0].items[0])), 'Detailed topic items belong on the topics subpage');
  const about = await readFile(new URL(`.${aboutSeo.path}index.html`, dist), 'utf8');
  for (const text of ['中電會', '2021 年 12 月 7 日', '深耕中部教育', '聯合參與社團']) {
    assert.ok(about.includes(text), `Missing about content: ${text}`);
  }
  assert.ok(!main.includes('深耕中部教育'), 'Detailed stats belong on the about subpage');
});

test('homepage sections follow the about, course topics, details order', () => {
  const position = (id) => main.indexOf(`id="${id}"`);
  assert.ok(position('about') < position('topics'));
  assert.ok(position('topics') < position('details'));
});

test('the topics subpage carries the full four-day schedule, and links point to it', async () => {
  const topics = await readFile(new URL(`.${topicsSeo.path}index.html`, dist), 'utf8');
  assert.ok(topics.includes('id="schedule"'));
  for (const day of campSchedule.days) {
    for (const { title } of day.events) assert.ok(topics.includes(title), `Missing schedule event: ${title}`);
  }
  assert.ok(!main.includes('href="#schedule"'), 'Homepage must not link to the removed #schedule anchor');
  assert.ok(main.includes(`href="${topicsSeo.path}#schedule"`));
});
test('fonts are subset, preloaded and cover every character on the prerendered pages', async () => {
  // 完整的 CJK 字型各約 3.4MB，會讓首屏卡很久；dist 裡只能有子集檔。
  const assets = await readdir(new URL('assets/', dist));
  const fontFiles = assets.filter((file) => file.endsWith('.woff2'));
  assert.ok(fontFiles.length >= 2, 'Expected the regular and bold font subsets');
  let fontBytes = 0;
  for (const file of fontFiles) {
    const { size } = await stat(new URL(`assets/${file}`, dist));
    assert.ok(size < 400 * 1024, `${file} is ${Math.round(size / 1024)}KB; subset the font instead of shipping it whole`);
    fontBytes += size;
    assert.ok(html.includes(`rel="preload" href="/assets/${file}" as="font"`), `Missing font preload: ${file}`);
  }
  assert.ok(fontBytes < 800 * 1024, 'Fonts should stay under 800KB in total');

  // 預先渲染出來的每個字都要在子集裡，否則會悄悄退回系統字型。
  const charset = await collectCharset();
  for (const page of [{ path: '/' }, ...subpages]) {
    const pageHtml = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    const visible = pageHtml.match(/<body>([\s\S]*)<\/body>/)[1]
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, '')
      .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&#39;', "'");
    const missing = [...new Set(visible)].filter((char) => !/\s/.test(char) && !charset.has(char));
    assert.deepEqual(missing, [], `${page.path}: characters missing from the font subset: ${missing.join('')}`);
  }
});

test('the document declares its charset first, before any long head content', async () => {
  for (const page of [{ path: '/' }, ...subpages]) {
    const pageHtml = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    const position = pageHtml.indexOf('<meta charset');
    assert.ok(position > -1 && position < 1024, `${page.path}: <meta charset> at byte ${position}, expected within the first 1024`);
  }
});
