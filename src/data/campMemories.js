export const testimonials = [
  {
    quote: '在這個營隊中我有學到知識又有認識到新朋友，還認識這專業方面的講師，甚至了解到了特殊選材，真的很充足。我如果第三天沒有不舒服的話，我應該是可以學到更多的知識……最後的那個提問真的很棒，我真的得到很多我想知道的資訊',
    name: '林O軒',
    camp: '2026 聯合寒訓',
  },
  {
    quote: '第一天看著身邊的人好像都很厲害，我完全不敢開口。但花了一個晚上把課程重新走過一遍，隔天竟然就跟上了七八成。後來才發現，其實很多人也都是第一次接觸，只是大家都不說。',
    name: '盧O聿',
    camp: '2026 聯合寒訓',
  },
  {
    quote: '帶我看見了世界，給我勇氣去研究一些酷東西，我下次會再來的',
    name: '高O程',
    camp: '2026 聯合寒訓',
  },
];

export const galleryPhotos = [
  { id: 'hero', src: '/img/gallery-optimized/hero.webp' },
  { id: 'top-right', src: '/img/gallery-optimized/top-right.webp' },
  { id: 'mid-right-1', src: '/img/gallery-optimized/mid-right-1.webp' },
  { id: 'mid-right-2', src: '/img/gallery-optimized/mid-right-2.webp' },
  { id: 'bot-left', src: '/img/gallery-optimized/bot-left.webp' },
  { id: 'bot-mid', src: '/img/gallery-optimized/bot-mid.webp' },
  { id: 'bot-right', src: '/img/gallery-optimized/bot-right.webp' },
];

export const photoArchives = [
  { year: '111', count: 7 },
  { year: '112', count: 8 },
  { year: '114', count: 18 },
].map(({ year, count }) => ({
  year,
  title: `${year} 聯合寒訓`,
  photos: Array.from({ length: count }, (_, index) =>
    `/img/photos-optimized/${year}/${String(index + 1).padStart(2, '0')}.webp`),
}));

// 照片牆的格子最大約 360px：用 360／720px 兩種寬度的縮圖（由 npm run images 從上面的原圖產生，
// PhotoWall 以 srcset 讓瀏覽器依格子大小挑選）；原圖保留給 og:image 等用途。
const wallImage = (src) => {
  const base = src
    .replace('/img/gallery-optimized/', '/img/wall/gallery/')
    .replace('/img/photos-optimized/', '/img/wall/photos/')
    .replace(/\.webp$/, '');
  return { src: `${base}-720.webp`, srcSet: `${base}-360.webp 360w, ${base}-720.webp 720w` };
};

// caption 同時是圖片的替代文字（alt）與滑過時顯示的說明。
export const wallPhotos = [
  ...galleryPhotos.map((photo) => ({ ...photo, caption: '歷屆聯合寒訓活動照片' })),
  ...photoArchives.flatMap(({ year, title, photos }) => photos.map((src, index) => ({
    id: `${year}-${index + 1}`,
    src,
    caption: `${title}活動照片`,
  }))),
].map(({ src, ...photo }) => ({ ...photo, ...wallImage(src) }));
