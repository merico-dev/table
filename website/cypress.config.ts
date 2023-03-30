import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [
          tsconfigPaths({
            projects: ['./tsconfig.cypress.json'],
          }),
          dts({
            entryRoot: resolve(__dirname, 'src'),
            insertTypesEntry: true,
          }),
        ],
      },
    },
  },
  video: false,
});
