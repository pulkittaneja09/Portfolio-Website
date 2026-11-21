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
        // Keep the initial bundle small: three.js and the 3D hero load on demand.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/three|@react-three/.test(id)) return 'three';
            if (/framer-motion/.test(id)) return 'motion';
            if (/react-router/.test(id)) return 'router';
            if (/cmdk/.test(id)) return 'cmdk';
          }
          return undefined;
        },
      },
    },
  },
});
