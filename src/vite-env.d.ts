/// <reference types="vite/client" />

/** Build-time numbers from config/site-plugin.ts. Either count can be null. */
declare module 'virtual:site-stats' {
  const stats: {
    leetcodeSolved: number | null;
    publicRepos: number | null;
    /** ISO date of the last commit. */
    updated: string;
  };
  export default stats;
}

/** Notes from content/notes, rendered at build time (config/notes.ts). Drafts only in dev. */
declare module 'virtual:notes' {
  const notes: {
    slug: string;
    title: string;
    /** YYYY-MM-DD */
    date: string;
    summary: string;
    html: string;
    draft: boolean;
  }[];
  export default notes;
}
