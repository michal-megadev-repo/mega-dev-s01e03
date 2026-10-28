import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

// These are observed exceptions, not a proven shared root cause.
export const REVIEW_GROUPS = ['parser', 'hint', 'unresolved'] as const;
export type ReviewGroup = (typeof REVIEW_GROUPS)[number];
export const labels: Record<ReviewGroup, string> = {
  parser: 'Shared parser — excluding the investigation queue',
  hint: 'booking-v3 date hint contradicts locale parsing',
  unresolved: 'Unresolved one-day / chronology symptoms',
};
const exceptionIds = new Set(notes.oneDayMove);
export const rawRows = (reports as Report[]).filter(r => r.mergedInto === 4471);
export const mergedReports = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);

export function reviewGroup(r: Report): ReviewGroup | null {
  if (exceptionIds.has(r.id)) return 'unresolved';
  return causeOf(r, tenantOf(r));
}

export const groups = REVIEW_GROUPS.map(cause => {
  const reports = mergedReports.filter(r => reviewGroup(r) === cause);
  const dates = reports.map(r => r.receivedAt.slice(0, 10)).sort();
  return { cause, label: labels[cause], reports, count: reports.length,
    tenants: new Set(reports.map(r => r.tenant)).size,
    first: dates[0], last: dates.at(-1) };
});
export const originalCounts = ['parser', 'hint'].map(cause => ({cause,
  count: mergedReports.filter(r => causeOf(r, tenantOf(r)) === cause).length,
  exceptions: mergedReports.filter(r => causeOf(r, tenantOf(r)) === cause && exceptionIds.has(r.id)).length,
}));
export const exceptions = mergedReports.filter(r => exceptionIds.has(r.id));
export const unplaced = mergedReports.filter(r => reviewGroup(r) === null);
export const weeklyQueue = (() => {
  const start = Date.parse('2026-03-30T00:00:00Z');
  const week = 7 * 86400000;
  const rows = Array.from({length:27}, (_,i) => ({
    week: new Date(start+i*week).toISOString().slice(0,10), received:0, merged:0,
  }));
  // Match QueueTimeline: original offset-bearing timestamps contribute their own date.
  for (const r of mergedReports) {
    const received = rows[Math.floor((Date.parse(r.receivedAt.slice(0,10))-start)/week)];
    if (received) received.received++;
    if (r.mergedAt) {
      const merged = rows[Math.floor((Date.parse(r.mergedAt.slice(0,10))-start)/week)];
      if (merged) merged.merged++;
    }
  }
  return rows;
})();
