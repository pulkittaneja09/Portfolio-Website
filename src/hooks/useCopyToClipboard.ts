import { useCallback } from 'react';
import { useToast } from '@/components/Toaster';

/**
 * Copies text and confirms with a toast. Falls back to a hidden textarea plus
 * execCommand on browsers that block the async clipboard API over http.
 */
export function useCopyToClipboard() {
  const toast = useToast();

  return useCallback(
    async (text: string, message = 'Copied to clipboard') => {
      try {
        await navigator.clipboard.writeText(text);
        toast(message);
        return true;
      } catch {
        try {
          const field = document.createElement('textarea');
          field.value = text;
          field.setAttribute('readonly', '');
          field.style.position = 'fixed';
          field.style.opacity = '0';
          document.body.appendChild(field);
          field.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(field);
          toast(ok ? message : 'Copy failed — select it manually');
          return ok;
        } catch {
          toast('Copy failed — select it manually');
          return false;
        }
      }
    },
    [toast],
  );
}
