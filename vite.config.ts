import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vercelApiPlugin } from './vite-api-plugin';

export default defineConfig({
  plugins: [
    // API plugin must be first to intercept /api/* before Vite tries to serve the files
    vercelApiPlugin(),
    react(),
  ],
  // Exclude the api/ directory from Vite's module graph
  server: {
    watch: {
      ignored: ['**/api/**'],
    },
  },
});
