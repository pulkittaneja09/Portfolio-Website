/**
 * "Jun 2026" → "Jul 2026" becomes "Jun — Jul 2026": a repeated year is noise,
 * and the shorter range fits the row's date column on one line.
 */
export function formatRange(start: string, end: string): string {
  const startYear = start.match(/\d{4}$/)?.[0];
  const endYear = end.match(/\d{4}$/)?.[0];
  if (startYear && startYear === endYear) {
    return `${start.replace(/\s*\d{4}$/, '')} — ${end}`;
  }
  return `${start} — ${end}`;
}
