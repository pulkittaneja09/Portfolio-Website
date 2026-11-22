import { AnimatePresence, m } from 'framer-motion';
import { CheckIcon } from '@/components/icons';
import { MotionRoot } from '@/components/MotionRoot';

export interface Toast {
  id: number;
  message: string;
}

/** The animated toast stack: a lazy chunk, loaded with the first toast. */
export default function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <MotionRoot>
      <AnimatePresence>
        {toasts.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[0.8125rem] text-strong shadow-overlay"
          >
            <CheckIcon className="h-3.5 w-3.5 text-body" />
            {t.message}
          </m.div>
        ))}
      </AnimatePresence>
    </MotionRoot>
  );
}
