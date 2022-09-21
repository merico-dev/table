import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const workspace = (...segments: string[]) => {
  return path.resolve(__dirname, '..', ...segments);
};

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_WEBSITE_BASE_URL,
  plugins: [
    react(),
    tsconfigPaths({
      projects: ['./', workspace('dashboard'), workspace('settings-form')],
    }),
  ],
  server: {
    port: 32000,
  },
  resolve: {
    alias: {
      '@devtable/dashboard': workspace('dashboard', 'src'),
      '@devtable/settings-form': workspace('settings-form', 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['@devtable/dashboard', '@devtable/settings-form'],
  },
});
