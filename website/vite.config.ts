import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const workspace = (...segments: string[]) => {
  return path.resolve(__dirname, '..', ...segments);
};

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.group('🔵 Loading ENV from', process.cwd());
  console.table(env);
  console.groupEnd();

  return defineConfig({
    base: env.VITE_WEBSITE_BASE_URL,
    plugins: [
      react(),
      tsconfigPaths({
        projects: ['./', workspace('dashboard'), workspace('settings-form')],
      }),
      viteStaticCopy({
        targets: [
          {
            src: '../node_modules/monaco-editor/min/vs/**/*',
            dest: 'assets/monaco-editor/min/vs/',
          },
        ],
      }),
    ],
    server: {
      port: 32000,
    },
    resolve: {
      alias: {
        '@devtable/dashboard': workspace('dashboard', 'src'),
        '@devtable/settings-form': workspace('settings-form', 'src'),
        'dayjs/locale': path.resolve(__dirname, '../node_modules/dayjs/locale'),
        'constrained-editor-plugin/dist/esm/constrainedEditor.js': path.resolve(
          __dirname,
          '../node_modules/constrained-editor-plugin/dist/esm/constrainedEditor.js',
        ),
      },
    },
    optimizeDeps: {
      exclude: ['@devtable/dashboard', '@devtable/settings-form'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: false,
      deps: {
        inline: ['echarts'],
      },
    },
    build: {
      rollupOptions: {
        external(source) {
          return source.includes('node_modules/monaco-editor/esm/vs/');
        },
      },
    },
  });
};
