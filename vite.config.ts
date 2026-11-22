import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { site } from './config/site-plugin';
import { GITHUB_USERNAME, profile, projects } from './src/data/portfolio';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    site({
      siteUrl: profile.siteUrl,
      routes: ['/', ...projects.map((project) => `/projects/${project.slug}`), '/uses'],
      leetcodeUser: profile.socials.find((social) => social.icon === 'leetcode')?.handle ?? '',
      githubUser: GITHUB_USERNAME,
      // All variables, not only VITE_*: GITHUB_TOKEN stays in this Node
      // process and is never inlined into the client bundle.
      githubToken: loadEnv(mode, process.cwd(), '').GITHUB_TOKEN || undefined,
      notesDir: 'content/notes',
      feed: {
        title: `Notes · ${profile.name}`,
        description: 'Notes on building AI agents, RAG systems and the backends that run them.',
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Stable vendor chunks: they change far less often than app code, so
        // a content edit does not bust the cache for React or Framer Motion.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/framer-motion/.test(id)) return 'motion';
            if (/cmdk/.test(id)) return 'cmdk';
            // React must be named before react-router, or rollup folds
            // react-dom into the router chunk.
            if (/node_modules\/(react-dom|react|scheduler)\//.test(id)) return 'react';
            if (/react-router/.test(id)) return 'router';
          }
          return undefined;
        },
      },
    },
  },
}));
