export type SlaTone = 'none' | 'warn' | 'danger';

const TZ = 'Asia/Bangkok';
const DAY_START = 8 * 60 + 30;
const DAY_END = 18 * 60;

type BangkokParts = {
  year: number;
  month: number;
  day: number;
  dow: number;
  minutes: number;
};

function bangkokParts(d: Date): BangkokParts {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '0';
  const weekday = pick('weekday');
  const dowMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number.parseInt(pick('year'), 10),
    month: Number.parseInt(pick('month'), 10),
    day: Number.parseInt(pick('day'), 10),
    dow: dowMap[weekday] ?? 0,
    minutes: Number.parseInt(pick('hour'), 10) * 60 + Number.parseInt(pick('minute'), 10),
  };
}

function dateKey(p: BangkokParts): string {
  return `${p.year}-${p.month}-${p.day}`;
}

function isWeekday(dow: number): boolean {
  return dow >= 1 && dow <= 5;
}

/** Business minutes from `from` (exclusive of non-business) to `to`. */
export function businessMinutesBetween(from: Date, to: Date): number {
  if (to <= from) return 0;

  let total = 0;
  let cursor = from;

  while (cursor < to) {
    const start = bangkokParts(cursor);
    if (!isWeekday(start.dow)) {
      cursor = nextDayStart(cursor);
      continue;
    }

    const end = bangkokParts(to);
    const sameDay = dateKey(start) === dateKey(end);

    const windowFrom = Math.max(start.minutes, DAY_START);
    const windowTo = sameDay ? Math.min(end.minutes, DAY_END) : DAY_END;

    if (windowFrom < DAY_END && windowTo > DAY_START && windowTo > windowFrom) {
      total += windowTo - windowFrom;
    }

    if (sameDay) break;
    cursor = nextDayStart(cursor);
  }

  return total;
}

function nextDayStart(d: Date): Date {
  return new Date(d.getTime() + 24 * 60 * 60 * 1000);
}

export function slaTone(createdAt: Date, now: Date, status: string): SlaTone {
  if (status !== 'new') return 'none';
  const nowParts = bangkokParts(now);
  if (!isWeekday(nowParts.dow) || nowParts.minutes < DAY_START || nowParts.minutes >= DAY_END) {
    return 'none';
  }
  const minutes = businessMinutesBetween(createdAt, now);
  if (minutes > 240) return 'danger';
  if (minutes > 120) return 'warn';
  return 'none';
}
