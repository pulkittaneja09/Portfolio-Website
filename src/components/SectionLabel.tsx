import { cn } from '@/lib/cn';

/**
 * The only section heading on the site: one plain word in small mono caps.
 * The content under it does the talking.
 */
export function SectionLabel({ children, id, className }: { children: string; id?: string; className?: string }) {
  return (
    <h2 id={id} className={cn('label', className)}>
      {children}
    </h2>
  );
}
