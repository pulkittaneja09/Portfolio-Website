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
