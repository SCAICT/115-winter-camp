import assert from 'node:assert/strict';
import { readFile, readdir, stat, access } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';
import { siteSeo, topicsSeo, aboutSeo, subpages } from '../src/data/siteSeo.js';
import { teamGroupOrder, teamMembers } from '../src/data/teamMembers.js';
import { campFaqs, courseTopics, learningOutcomes, teachingPoints } from '../src/data/campGuide.js';
import { winterCamp, calendarPath } from '../src/data/winterCamp.js';
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
    // 內容還沒公布的頁面（noindex）：不收錄、不進 sitemap；其餘頁面一定要在 sitemap 裡。
    assert.equal(sitemap.includes(`<loc>${page.url}</loc>`), !page.noindex, `${page.path}: sitemap entry`);
    assert.equal(/<meta name="robots" content="noindex, follow"/.test(html), Boolean(page.noindex), `${page.path}: robots meta`);
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

test('search result snippets stay short enough to avoid truncation, and subpages carry breadcrumbs', async () => {
  // 中文字佔兩個半形字寬；Google 約顯示 600px 標題（約 60 半形字寬）與 160 半形字寬的摘要。
  const width = (text) => [...text].reduce((sum, char) => sum + (/[\u2e80-\u9fff\uff00-\uffef]/.test(char) ? 2 : 1), 0);
  for (const page of [siteSeo, ...subpages]) {
    assert.ok(width(page.title) <= 64, `${page.title}: title is too long (${width(page.title)})`);
    assert.ok(width(page.description) <= 170, `${page.description}: description is too long (${width(page.description)})`);
  }
  for (const page of subpages) {
    const pageHtml = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    const graph = JSON.parse(pageHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const breadcrumb = graph.find((item) => item['@type'] === 'BreadcrumbList');
    assert.deepEqual(breadcrumb.itemListElement.map(({ item }) => item), [siteSeo.url, page.url]);
    assert.ok(graph.some((item) => item['@type'] === 'EducationEvent'), `${page.path}: keeps the event data`);
  }
});

test('Chinese text is separated from numbers by a space on every prerendered page', async () => {
  for (const page of [{ path: '/' }, ...subpages]) {
    const pageHtml = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    const text = pageHtml
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<script(?! type="application\/ld\+json")[\s\S]*?<\/script>/g, '');
    const missing = [...text.matchAll(/.{0,10}(?:[\u4e00-\u9fff][0-9]|[0-9][\u4e00-\u9fff]).{0,10}/g)].map(([match]) => match);
    assert.deepEqual(missing, [], `${page.path}: missing a space between Chinese and numbers`);
  }
});

test('the social preview image matches the declared type and size, and its meta tags are present', async () => {
  const file = new URL(`.${new URL(siteSeo.image).pathname}`, dist);
  const { width, height, format } = await sharp(await readFile(file)).metadata();
  assert.equal(width, siteSeo.imageWidth, 'og:image width');
  assert.equal(height, siteSeo.imageHeight, 'og:image height');
  assert.equal(`image/${format}`, siteSeo.imageType);
  for (const [key, value] of [['og:image:type', siteSeo.imageType], ['og:image:width', siteSeo.imageWidth], ['og:image:height', siteSeo.imageHeight]]) {
    assert.ok(html.includes(`<meta property="${key}" content="${value}">`), key);
  }
  assert.ok((await stat(file)).size < 600 * 1024, 'The preview image should stay under 600KB so chat apps do not skip it');
});

test('icons, robots directives and structured data are complete for search results', async () => {
  assert.ok(html.includes('max-image-preview:large'));
  for (const [file, size] of [['favicon-16x16.png', 16], ['favicon-32x32.png', 32], ['favicon-48x48.png', 48], ['apple-touch-icon.png', 180]]) {
    assert.ok(html.includes(`href="/${file}"`), `Missing icon link: ${file}`);
    const metadata = await sharp(await readFile(new URL(file, dist))).metadata();
    assert.deepEqual([metadata.width, metadata.height], [size, size], file);
  }
  const graph = JSON.parse(jsonLd[0][1])['@graph'];
  const faq = graph.find((item) => item['@type'] === 'FAQPage');
  assert.deepEqual(faq.mainEntity.map(({ name }) => name), campFaqs.map(({ question }) => question));
  for (const { name } of faq.mainEntity) assert.ok(main.includes(name), `FAQ question is not visible on the page: ${name}`);
  const event = graph.find((item) => item['@type'] === 'EducationEvent');
  assert.equal(event.typicalAgeRange, '15-18');
  assert.ok(event.offers.every((offer) => offer.availability === 'https://schema.org/InStock'));
  assert.ok(graph.find((item) => item['@type'] === 'Organization').logo.endsWith('/apple-touch-icon.png'));
  for (const page of subpages) {
    const pageHtml = await readFile(new URL(`.${page.path}index.html`, dist), 'utf8');
    assert.ok(!pageHtml.includes('FAQPage'), `${page.path}: FAQPage belongs on the homepage only`);
  }
});

test('registration documents and the calendar keep a visible entry, linked once a URL is set', () => {
  for (const { label, url } of winterCamp.ticket.resources) {
    assert.ok(main.includes(label), `Missing entry: ${label}`);
    if (url) assert.ok(main.includes(`href="${url}"`), `${label} should link to ${url}`);
    else assert.ok(main.includes(`<strong>${label}</strong><small>準備中</small>`), `${label} should show it is not ready yet`);
  }
});

test('the calendar file lists the camp and every registration deadline in valid iCalendar format', async () => {
  const ics = await readFile(new URL(`.${calendarPath}`, dist), 'utf8');
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(!/(^|[^\r])\n/.test(ics), 'Lines must end with CRLF');
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, `Line is longer than 75 bytes: ${line}`);
  const unfolded = ics.replaceAll('\r\n ', '');
  const [start, end] = winterCamp.dates.split(' ~ ');
  const nextDay = (date) => new Date(Date.parse(`${date}T00:00:00Z`) + 86400000).toISOString().slice(0, 10).replaceAll('-', '');
  assert.ok(unfolded.includes(`DTSTART;VALUE=DATE:${start.replaceAll('-', '')}\r\nDTEND;VALUE=DATE:${nextDay(end)}`));
  for (const period of winterCamp.ticket.registrationPeriods) {
    assert.ok(unfolded.includes(`DTSTART;VALUE=DATE:${period.endsOn.replaceAll('-', '')}`), `Missing deadline: ${period.name}`);
    assert.ok(unfolded.includes(`${period.name}報名截止`));
  }
  assert.equal([...unfolded.matchAll(/BEGIN:VEVENT/g)].length, 1 + winterCamp.ticket.registrationPeriods.length);
  // 三種加入方式：Google 訂閱、Apple（webcal）、iCal 下載。
  assert.deepEqual(winterCamp.ticket.calendar.map(({ label }) => label), ['Google Calendar', 'Apple Calendar', 'iCal']);
  for (const { label, href, download } of winterCamp.ticket.calendar) {
    assert.ok(main.includes(`<strong>${label}</strong>`), `Missing calendar entry: ${label}`);
    assert.ok(href.includes(calendarPath), `${label} should point at the calendar file`);
    assert.ok(main.includes(`href="${href}"`), `Homepage should link to ${href}`);
    assert.equal(main.includes(`href="${href}" download`), Boolean(download), `${label} download attribute`);
  }
});

test('the team page lists every member under their groups, with optimized avatars', async () => {
  const page = await readFile(new URL('./team/index.html', dist), 'utf8');
  for (const { name, groups, avatar, website } of teamMembers) {
    assert.ok(groups.every((group) => teamGroupOrder.includes(group)), `${name}: unknown group`);
    assert.ok(page.includes(`>${name}`), `Missing member: ${name}`);
    const { size } = await stat(new URL(`.${avatar}`, dist));
    assert.ok(size < 30 * 1024, `${avatar} is ${Math.round(size / 1024)}KB; resize avatars instead of shipping originals`);
    if (website) assert.ok(page.includes(`href="${website}"`), `${name}: website link`);
    assert.ok(!website || /^https?:\/\//.test(website), `${name}: website needs a protocol`);
  }
  // 沒有成員的組別不顯示；有成員的組別一定要有標題。
  for (const group of teamGroupOrder) {
    const hasMembers = teamMembers.some(({ groups }) => groups.includes(group));
    assert.equal(page.includes(`id="team-${group}"`), hasMembers, `Group heading: ${group}`);
  }
  assert.ok(main.includes('href="/team/"'), 'The homepage should link to the team page');
});