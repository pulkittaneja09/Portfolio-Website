import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
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
});
