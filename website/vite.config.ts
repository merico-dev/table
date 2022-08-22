import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

const workspace = (...segments: string[]) => {
  return path.resolve(__dirname, '..', ...segments);
};

// https://vitejs.dev/config/
const root = path.resolve(__dirname, '..');
export default defineConfig({
  plugins: [react()],
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
