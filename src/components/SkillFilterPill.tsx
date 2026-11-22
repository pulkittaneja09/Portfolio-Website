import { CloseIcon } from '@/components/icons';
import { setActiveSkill, useActiveSkill } from '@/lib/skills';

/**
 * "Showing work with FastAPI · Clear ✕" — shown above the projects while a
 * skill from the Skills section is active, and sticky while you read through
 * them. Clicking it (or pressing Escape) clears the filter.
 */
export function SkillFilterPill() {
  const skill = useActiveSkill();
  if (!skill) return null;

  return (
    <div className="sticky top-20 z-20 mb-6 lg:top-6" role="status">
      <button
        type="button"
        onClick={() => setActiveSkill(null)}
        className="glass group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-body shadow-float transition-colors duration-200 hover:text-strong"
      >
        <span>
          Showing work with <span className="font-medium text-strong">{skill}</span>
        </span>
        <span className="text-faint" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1">
          Clear
          <CloseIcon className="h-3.5 w-3.5 transition-colors duration-200 group-hover:text-accent" />
        </span>
      </button>
    </div>
  );
}
