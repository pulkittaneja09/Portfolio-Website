/**
 * "Mar 2026" → "Present" becomes "Mar 2026 – Present": one pattern for every
 * range on the site, as on the résumé (full years, an en dash with spaces).
 */
export function formatRange(start: string, end: string): string {
  return `${start} – ${end}`;
}
