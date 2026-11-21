import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-md text-muted transition-colors duration-400 ease-quiet hover:bg-light/[0.05] hover:text-text',
        className,
      )}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <SunIcon className="h-[15px] w-[15px]" /> : <MoonIcon className="h-[15px] w-[15px]" />}
    </button>
  );
}
