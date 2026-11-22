import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';
import { toggleTheme } from '@/lib/theme';

/**
 * Sun in the dark theme, moon in the light one. The new theme is revealed in
 * a circle growing from this button (lib/theme.ts); `data-theme-toggle` lets
 * ⌘K and the terminal reveal from here too.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-md text-body transition-colors duration-200 hover:text-strong',
        className,
      )}
      aria-label={`Switch to the ${next} theme`}
      title={`Switch to the ${next} theme`}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-[18px] w-[18px]" />
      ) : (
        <SunIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
