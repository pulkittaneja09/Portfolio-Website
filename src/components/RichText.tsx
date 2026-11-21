import { Fragment } from 'react';

/**
 * The two pieces of inline emphasis the copy is allowed:
 *
 *   **phrase**  white highlight inside grey body text
 *   *word*      the accent serif, Instrument Serif italic
 *
 * Kept as a tiny parser over strings so all copy stays plain text in
 * `portfolio.ts` instead of JSX scattered through components.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-medium text-strong">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={i} className="serif">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
