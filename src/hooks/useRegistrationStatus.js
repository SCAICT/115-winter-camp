import { winterCamp } from '../data/winterCamp';
import useTaipeiDate from './useTaipeiDate';

const DAY = 24 * 60 * 60 * 1000;
const formatDate = (value) => value.replaceAll('-', '/');
const formatShortDate = (value) => value.slice(5).replace('-', '/');
const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

// 報名表單網址；尚未開放時退回首頁票價區。home 為子頁使用（例如 "/"）。
export function registerLink(home = '') {
  const { url } = winterCamp.ticket;
  return url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : { href: `${home}#ticket` };
}

// 依台灣時間判斷目前報名階段與剩餘天數。today 為 null（SSR／首次渲染）時所有欄位為空，
// 讓建置時產出的 HTML 與瀏覽器第一次渲染一致。
export default function useRegistrationStatus() {
  const today = useTaipeiDate();
  const { registrationPeriods, plans } = winterCamp.ticket;
  const priceOf = (period) => plans.find(({ name }) => name === period.plan)?.price;

  if (!today) return { today, currentPeriod: null, nextPeriod: null, daysLeft: null, price: null, deadline: null, label: '' };

  const currentPeriod = registrationPeriods.find((period) => period.startsOn <= today && today <= period.endsOn) ?? null;
  const nextPeriod = registrationPeriods.find((period) => today < period.startsOn) ?? null;
  // 截止日當天 23:59 結束，所以截止當天為「最後一天」（daysLeft = 0）。
  const daysLeft = currentPeriod ? daysBetween(today, currentPeriod.endsOn) : null;
  const daysText = daysLeft === 0 ? '今天截止' : `剩 ${daysLeft} 天`;

  let label = '';
  if (currentPeriod) label = `${currentPeriod.name}報名中，${formatShortDate(currentPeriod.endsOn)} 截止（${daysText}）`;
  else if (nextPeriod) label = `${nextPeriod.name}報名 ${formatShortDate(nextPeriod.startsOn)} 開放`;

  return {
    today,
    currentPeriod,
    nextPeriod,
    daysLeft,
    daysText: currentPeriod ? daysText : '',
    price: currentPeriod ? priceOf(currentPeriod) : null,
    deadline: currentPeriod ? formatDate(currentPeriod.endsOn) : null,
    label,
  };
}
