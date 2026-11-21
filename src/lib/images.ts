/**
 * Each preview ships at 1024px and 640px. Cards render around 450-700px wide,
 * so the browser almost always picks the smaller file.
 */
export function previewSrcSet(src: string): string | undefined {
  if (!src.endsWith('.webp')) return undefined;
  const small = src.replace(/\.webp$/, '-sm.webp');
  return `${small} 640w, ${src} 1024w`;
}
