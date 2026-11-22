import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

/**
 * Notes are plain Markdown files in content/notes/, with a small frontmatter
 * block:
 *
 *   ---
 *   title: RAG that cites its sources
 *   date: 2026-12-01
 *   summary: One sentence for the list, the feed and the meta description.
 *   draft: true
 *   ---
 *
 * They are rendered to HTML at build time, so Markdown costs nothing in the
 * browser. A note with `draft: true` never reaches a production build: it is
 * not in the bundle, the feed or the sitemap. The dev server shows drafts,
 * marked as such, so you can read them while you write.
 */

export interface Note {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
  html: string;
  draft: boolean;
}

function frontmatter(source: string): { data: Record<string, string | boolean>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string | boolean> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    const raw = pair[2].trim();
    data[pair[1]] = raw === 'true' ? true : raw === 'false' ? false : raw.replace(/^(['"])(.*)\1$/, '$2');
  }
  return { data, body: source.slice(match[0].length) };
}

/** Every note in `dir`, newest first; drafts only when `includeDrafts`. */
export function readNotes(dir: string, includeDrafts: boolean): Note[] {
  let files: string[];
  try {
    files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      const { data, body } = frontmatter(readFileSync(join(dir, file), 'utf8'));
      return {
        slug: file.replace(/\.md$/, ''),
        title: String(data.title ?? file),
        date: String(data.date ?? ''),
        summary: String(data.summary ?? ''),
        draft: data.draft === true,
        html: marked.parse(body, { async: false }),
      };
    })
    .filter((note) => includeDrafts || !note.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** RSS 2.0 with full content, for published notes only. */
export function rssFeed(siteUrl: string, title: string, description: string, notes: Note[]): string {
  const items = notes
    .map((note) =>
      [
        '    <item>',
        `      <title>${escape(note.title)}</title>`,
        `      <link>${siteUrl}/notes/${note.slug}</link>`,
        `      <guid isPermaLink="true">${siteUrl}/notes/${note.slug}</guid>`,
        `      <pubDate>${new Date(`${note.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escape(note.summary)}</description>`,
        `      <content:encoded><![CDATA[${note.html.split(']]>').join(']]]]><![CDATA[>')}]]></content:encoded>`,
        '    </item>',
      ].join('\n'),
    )
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escape(title)}</title>`,
    `    <link>${siteUrl}/notes</link>`,
    `    <description>${escape(description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
