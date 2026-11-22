import { Suspense, createContext, lazy, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Toast } from '@/components/ToastViewport';

// The animated stack (and with it Framer Motion) loads with the first toast,
// so the page's critical path carries none of it.
const ToastViewport = lazy(() => import('@/components/ToastViewport'));

const ToastContext = createContext<{ toast: (message: string) => void } | null>(null);

/** Small bottom-centre toast stack. Used for clipboard and form feedback. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [used, setUsed] = useState(false);
  const nextId = useRef(0);

  const toast = useCallback((message: string) => {
    const id = (nextId.current += 1);
    setUsed(true);
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex print:hidden flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {used && (
          <Suspense fallback={null}>
            <ToastViewport toasts={toasts} />
          </Suspense>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>');
  return value.toast;
}
