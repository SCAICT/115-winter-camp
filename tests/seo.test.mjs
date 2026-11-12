import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
import { siteSeo, topicsSeo, aboutSeo, subpages } from '../src/data/siteSeo.js';
import { courseTopics } from '../src/data/campGuide.js';
import { winterCamp } from '../src/data/winterCamp.js';
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

test('subpages carry the detailed content that the homepage only summarises', async () => {
  const topics = await readFile(new URL(`.${topicsSeo.path}index.html`, dist), 'utf8');
  for (const { title, outcome } of courseTopics) {
    assert.ok(topics.includes(title), `Missing topic title: ${title}`);
    assert.ok(topics.includes(outcome), `Missing topic outcome: ${title}`);
  }
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