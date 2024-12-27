import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import visualizer from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { dependencies, peerDependencies } from './package.json';
import { writeVersionFile } from './rollup-plugin-write-version-file';
import * as path from 'path';
import { escapeRegExp } from 'lodash';

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

class ModuleExternalizer {
  makeModuleIdMatcher(id: string) {
    return new RegExp(`^${escapeRegExp(id)}`);
  }
  dependencies = Object.keys(dependencies)
    .concat(Object.keys(peerDependencies))
    .concat([
      // babel transforms module id of emotion, we need to exclude all of them
      '@emotion',
    ])
    .map((it) => this.makeModuleIdMatcher(it));
  extraPaths = ['/node_modules/echarts', '/node_modules/dayjs'].map((it) => new RegExp(escapeRegExp(it)));
  matchers = this.dependencies.concat(this.extraPaths);

  shouldExternalize(id: string) {
    return this.matchers.some((matcher) => matcher.test(id));
  }
}

const moduleExternalizer = new ModuleExternalizer();

const externals = (id: string) => {
  return moduleExternalizer.shouldExternalize(id);
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
      inline: ['echarts', '@mantine/dates'],
    },
    alias: {
      'dayjs/plugin': path.resolve(__dirname, '../node_modules/dayjs/plugin'),
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
