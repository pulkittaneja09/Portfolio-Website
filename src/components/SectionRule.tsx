/**
 * A 1px hairline in the gap above a section, drawn absolutely so it never
 * changes the rhythm. Still: Round 5's animation audit removed the travelling
 * dot (one moving thing per viewport).
 */
export function SectionRule() {
  return <div className="section-rule" aria-hidden />;
}
