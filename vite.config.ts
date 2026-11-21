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
    // three.js is inherently large. It lives in its own chunk that is only
    // fetched on the first pointer movement, so the default 500KB warning
    // does not reflect anything a visitor actually downloads up front.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the initial bundle small: three.js and the 3D hero load on demand.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/three|@react-three/.test(id)) return 'three';
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
