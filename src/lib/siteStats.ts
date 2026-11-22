import site from 'virtual:site-stats';
import { profile, stats } from '@/data/portfolio';
import type { Stat } from '@/data/types';

/**
 * Numbers fetched at build time (see config/site-plugin.ts). The page never
 * calls LeetCode or GitHub itself, so CORS and rate limits cannot break it;
 * when a count is unknown the copy simply leaves the number out.
 */
export const siteStats = site;

/** `stats` with the public repo count swapped for the build-time one, when there is one. */
export const liveStats: Stat[] = stats.map((stat) =>
  stat.live === 'publicRepos' && site.publicRepos !== null ? { ...stat, value: site.publicRepos } : stat,
);

export const leetcodeProfile = profile.socials.find((social) => social.icon === 'leetcode');

/** "120 problems solved on LeetCode", or just "LeetCode" when the count is unknown. */
export const leetcodeLabel =
  site.leetcodeSolved !== null ? `${site.leetcodeSolved} problems solved on LeetCode` : 'LeetCode';

/** "November 2026": the month of the last commit, for the footer. */
export const updatedLabel = new Date(site.updated).toLocaleDateString('en-GB', {
  month: 'long',
  year: 'numeric',
});
