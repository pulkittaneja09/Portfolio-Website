import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Kolkata';

function istNow(): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(new Date());
}

/**
 * "Chennai · 23:41 IST", ticking once a minute.
 *
 * Aligned to the top of the minute rather than polling every second, so the
 * page wakes the main thread sixty times less often while idle.
 */
export function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState(istNow);

  useEffect(() => {
    let interval = 0;

    const align = window.setTimeout(
      () => {
        setTime(istNow());
        interval = window.setInterval(() => setTime(istNow()), 60_000);
      },
      (60 - new Date().getSeconds()) * 1000,
    );

    return () => {
      window.clearTimeout(align);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <span className={className}>
      Chennai · <time dateTime={time}>{time}</time> IST
    </span>
  );
}
