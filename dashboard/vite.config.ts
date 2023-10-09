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

const EXTERNAL_PATHS = [
  'echarts/core',
  'echarts/components',
  'echarts/renderers',
  'echarts/charts',
  'echarts-for-react/lib/core',
  '/node_modules/echarts',
  '/node_modules/dayjs',
];
const DEPENDENCIES = new Set(Object.keys(dependencies).concat(Object.keys(peerDependencies)));
const externals = (id: string, importer: any, isResolved: boolean) => {
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
  resolve: {
    alias: {
      react: 'react',
      'react/jsx-runtime.js': 'react/jsx-runtime.js',
      'reactflow/dist/style.css': 'reactflow/dist/style.css',
      'dayjs/plugin': 'dayjs/plugin',
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
      plugins: [visualizer({ emitFile: true })],
      external: externals,
      output: {
        globals: (name) => {
          if (!name.includes('node_modules')) {
            const ret = GLOBAL_MODULE_IDS[name];
            return ret ?? name;
          }
          const match = EXTERNAL_PATHS.find((p) => name.includes(p));
          if (match) {
            return match.replace('/node_modules/', '');
          }
          const id = name.replace(/^\/.+\/table\/node_modules\/([\w|\-]+)\/.+$/, '$1');
          const ret = GLOBAL_MODULE_IDS[id];
          return ret ?? name;
        },
      },
    },
  },
});
