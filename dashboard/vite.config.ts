import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import visualizer from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { dependencies, peerDependencies } from './package.json';

const GLOBAL_MODULE_IDS = {
  'crypto-js': 'CryptoJS',
  lodash: '_',
};

const EXTERNAL_PATHS = ['/node_modules/echarts', '/node_modules/react', '/node_modules/dayjs'];
const DEPENDENCIES = new Set(Object.keys(dependencies).concat(Object.keys(peerDependencies)));
const externals = (id: string) => {
  // babel transforms module id of emotion, we need to exclude all of them
  if (id.startsWith('@emotion')) {
    return true;
  }
  if (EXTERNAL_PATHS.some((p) => id.includes(p))) {
    return true;
  }
  return DEPENDENCIES.has(id);
};

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [process.env.VITEST ? './tsconfig.test.json' : './tsconfig.json'],
    }),
    react({
      babel: {
        plugins: ['@emotion', 'macros'],
      },
    }),
    dts({
      entryRoot: resolve(__dirname, 'src'),
      insertTypesEntry: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    deps: {
      inline: ['echarts'],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'dashboard',
      formats: ['es', 'umd'],
      fileName: (format) => `dashboard.${format}.js`,
    },
    rollupOptions: {
      plugins: [visualizer()],
      external: externals,
      output: {
        globals: (id) => {
          return GLOBAL_MODULE_IDS[id] ?? id;
        },
      },
    },
  },
});
