import { useEffect } from 'react';
import { profile } from '@/data/portfolio';

/** Keeps the document title and description in step with the route. */
export function useDocumentMeta(title: string, description: string, canonicalPath: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const setMeta = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      const previous = element?.getAttribute(attribute) ?? null;
      element?.setAttribute(attribute, value);
      return () => {
        if (previous !== null) element?.setAttribute(attribute, previous);
      };
    };

    const restore = [
      setMeta('meta[name="description"]', 'content', description),
      setMeta('meta[property="og:title"]', 'content', title),
      setMeta('meta[property="og:description"]', 'content', description),
      setMeta('meta[property="og:url"]', 'content', `${profile.siteUrl}${canonicalPath}`),
      setMeta('link[rel="canonical"]', 'href', `${profile.siteUrl}${canonicalPath}`),
    ];

    return () => {
      document.title = previousTitle;
      restore.forEach((undo) => undo());
    };
  }, [title, description, canonicalPath]);
}
