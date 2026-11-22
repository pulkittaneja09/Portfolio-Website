import { sections } from '@/lib/sections';
import { cn } from '@/lib/cn';
import { stagger } from '@/lib/stagger';

/**
 * The in-page nav: a hairline and a mono label per section. The section in
 * view gets a accent line twice as long and white text; hovering or
 * focusing any item previews the same state.
 */
export function SectionNav({ active, className }: { active: string | null; className?: string }) {
  return (
    <nav aria-label="Sections" className={className}>
      <ul className="w-max">
        {sections.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="enter" style={stagger(4 + i)}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className="group flex items-center gap-4"
              >
                <span
                  className={cn(
                    'h-px transition-[width,background-color] duration-300 motion-reduce:transition-none',
                    isActive
                      ? 'w-16 bg-accent'
                      : 'w-8 bg-faint group-hover:w-16 group-hover:bg-accent group-focus-visible:w-16 group-focus-visible:bg-accent',
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    'label transition-colors duration-300',
                    isActive
                      ? 'text-strong'
                      : 'text-body/80 group-hover:text-strong group-focus-visible:text-strong',
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
