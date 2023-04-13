import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import visualizer from 'rollup-plugin-visualizer';
import { dependencies, peerDependencies } from './package.json';

const GLOBAL_MODULE_IDS = {
  'crypto-js': 'CryptoJS',
  lodash: '_',
};

const DEPENDENCIES = new Set(Object.keys(dependencies).concat(Object.keys(peerDependencies)));
const externals = (id: string) => {
  // babel transforms module id of emotion, we need to exclude all of them
  return id.startsWith('@emotion') || DEPENDENCIES.has(id);
};

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion', 'macros'],
      },
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'settings-form',
      formats: ['es', 'umd'],
      fileName: (format) => `settings-form.${format}.js`,
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
