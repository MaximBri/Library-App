/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/app/styles/variables.scss" as *;
        `,
        },
      },
    },
});
