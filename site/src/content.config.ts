import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 리포트 원본은 저장소의 reports/*.md (site/ 기준 ../reports)
const marketItem = z.object({
  label: z.string(),
  value: z.string(),
  change: z.number().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
});

const reports = defineCollection({
  loader: glob({ pattern: '*.md', base: '../reports' }),
  schema: z.object({
    type: z.enum(['sat_review', 'sun_plan']),
    date: z.coerce.date(),
    period: z.string().optional(),
    title: z.string(),
    summary: z.string(),
    test: z.boolean().optional(),
    // 토요일
    warning: z.string().optional(),
    market: z
      .object({
        asof: z.string().optional(),
        source: z.string().optional(),
        items: z.array(marketItem).default([]),
      })
      .optional(),
    // 일요일
    stance: z.string().optional(),
    plan: z.string().optional(),
    approved_buys: z.number().optional(),
    new_candidates: z.number().optional(),
    avoid: z.string().optional(),
    scenarios: z
      .array(
        z.object({
          case: z.string(),
          title: z.string(),
          range: z.string(),
          sub: z.string().optional(),
          condition: z.string().optional(),
          action: z.string().optional(),
        }),
      )
      .optional(),
    schedule: z
      .array(z.object({ date: z.string(), event: z.string(), key: z.boolean().optional() }))
      .optional(),
    watchlist: z
      .array(
        z.object({
          name: z.string(),
          code: z.string(),
          score: z.number(),
          type: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

// 매매일지·실패노트 원본 (../journal/02_trade_journal.md)
const journal = defineCollection({
  loader: glob({ pattern: '02_trade_journal.md', base: '../journal' }),
});

export const collections = { reports, journal };
