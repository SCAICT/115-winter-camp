import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import test from 'node:test';
import { siteSeo } from '../src/data/siteSeo.js';
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
  for (const text of ['2027', '寒假', '營隊', '冬日營', '高中生', '臺中', winterCamp.venue, '黑客松', '成果發表', '沒有程式基礎']) {
    assert.ok(main.includes(text), `Missing prerendered content: ${text}`);
  }
  for (const section of ['about', 'details', 'schedule', 'ticket', 'faq']) {
    assert.ok(main.includes(`id="${section}"`), section);
  }
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
  assert.ok(main.includes(event.location.address.streetAddress));
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
