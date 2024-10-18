import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import visualizer from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { dependencies, peerDependencies } from './package.json';
import { writeVersionFile } from './rollup-plugin-write-version-file';

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
  /^dayjs\/plugin/,
  /^dayjs$/,
  // babel transforms module id of emotion, we need to exclude all of them
  /^@emotion/,
];

function shouldExternalize(id: string) {
  // check id against external paths
  for (const path of EXTERNAL_PATHS) {
    if (typeof path === 'string') {
      if (id.includes(path)) {
        return true;
      }
    } else if (path.test(id)) {
      return true;
    }
  }
  return false;
}

const DEPENDENCIES = new Set(Object.keys(dependencies).concat(Object.keys(peerDependencies)));
const externals = (id: string) => {
  if (shouldExternalize(id)) {
    return true;
  }
  return DEPENDENCIES.has(id);
};

export default defineConfig({
  plugins: [
    // @ts-expect-error PluginOption
    tsconfigPaths({
      projects: [process.env.VITEST ? './tsconfig.test.json' : './tsconfig.json'],
    }),
    // @ts-expect-error PluginOption
    react({
      babel: {
        plugins: ['@emotion', 'macros'],
      },
    }),
    // @ts-expect-error PluginOption
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
      'constrained-editor-plugin/dist/esm/constrainedEditor.js': resolve(
        __dirname,
        '../node_modules/constrained-editor-plugin/dist/esm/constrainedEditor.js',
      ),
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
      plugins: [visualizer({ emitFile: true }), writeVersionFile()],
      external: externals,
      output: {
        globals: (name) => {
          if (!name.includes('node_modules')) {
            const ret = GLOBAL_MODULE_IDS[name];
            return ret ?? name;
          }
          const match = (EXTERNAL_PATHS.filter((it) => typeof it === 'string') as string[]).find((p) =>
            name.includes(p),
          );
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
