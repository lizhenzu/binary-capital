import { getCollection, type CollectionEntry } from 'astro:content';

export type Report = CollectionEntry<'reports'>;

const KIND = {
  sat_review: { label: '토요 복기', long: '토요 · 지난주 복기', rangeLabel: '대상' },
  sun_plan: { label: '일요 준비', long: '일요 · 다음 주 준비', rangeLabel: '대상 주간' },
} as const;

export const kind = (r: Report) => KIND[r.data.type];

/** 최신순. 같은 날짜면 일요 준비를 앞에 둔다. */
export async function getReports(): Promise<Report[]> {
  const all = await getCollection('reports');
  return all.sort((a, b) => {
    const d = b.data.date.getTime() - a.data.date.getTime();
    if (d !== 0) return d;
    return a.data.type === 'sun_plan' ? -1 : 1;
  });
}

export const href = (r: Report) => `/reports/${r.id}/`;

const pad = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
export const md = (d: Date) => `${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
const WD = ['일', '월', '화', '수', '목', '금', '토'];
export const ymdw = (d: Date) => `${ymd(d)}(${WD[d.getUTCDay()]})`;

/** 다음 발행 예정 토요일 */
export function nextSaturday(from: Date) {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() + ((6 - d.getUTCDay() + 7) % 7 || 7));
  return d;
}

export function changeView(change?: number, unit = '%') {
  if (change === undefined) return null;
  const up = change > 0;
  const down = change < 0;
  const abs = Math.abs(change);
  const digits = unit === '%p' ? 3 : 2;
  return {
    text: `${up ? '▲' : down ? '▼' : ''} ${abs.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '')}${unit}`.trim(),
    cls: up ? 'up' : down ? 'down' : '',
  };
}

export const MISTAKE_CODES = /\bM(0[1-9]|1[0-2])\b/g;

/** 리포트 본문에서 실수 코드가 언급된 횟수 */
export function countMentions(reports: Report[]) {
  const counts: Record<string, number> = {};
  for (const r of reports) {
    for (const m of (r.body ?? '').matchAll(MISTAKE_CODES)) {
      counts[m[0]] = (counts[m[0]] ?? 0) + 1;
    }
  }
  return counts;
}

/** 매매일지의 마크다운 표 한 개를 행 배열로 읽는다 (헤더 행 이후) */
function readTable(section: string): string[][] {
  const rows = section
    .split('\n')
    .filter((l) => l.trim().startsWith('|'))
    .map((l) =>
      l
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim()),
    );
  return rows.filter((r, i) => i > 0 && !r.every((c) => /^:?-+:?$/.test(c)));
}

function section(body: string, letter: string) {
  const re = new RegExp(`^## ${letter}\\. [^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm');
  return body.match(re)?.[1] ?? '';
}

export async function getJournal() {
  const [entry] = await getCollection('journal');
  const body = entry?.body ?? '';
  const codes = readTable(section(body, 'C'))
    .filter((r) => /^M\d\d$/.test(r[0]))
    .map(([code, name, desc]) => ({ code, name, desc }));
  const failRows = readTable(section(body, 'D')).filter((r) => r[0] && !r[0].startsWith('('));
  const rules = section(body, 'E')
    .split('\n')
    .map((l) => l.match(/^\d+\.\s+(.*)$/)?.[1])
    .filter((x): x is string => !!x);
  const updates = section(body, 'D')
    .split('\n')
    .map((l) => l.match(/^(\d{4}-\d{2}-\d{2}) 갱신:\s*(.*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ date: m[1], text: m[2] }));
  return { entry, codes, failRows, rules, updates };
}
