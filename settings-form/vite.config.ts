import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import visualizer from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
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
      external: [
        '@emotion/react',
        '@mantine/core',
        '@mantine/hooks',
        '@mantine/modals',
        '@mantine/notifications',
        'ahooks',
        'axios',
        'crypto-js',
        'lodash',
        'react',
        'react-dom',
        'react-hook-form',
        'tabler-icons-react',
      ],
      output: {
        globals: {
          '@emotion/react': '@emotion/react',
          '@mantine/core': '@mantine/core',
          '@mantine/hooks': '@mantine/hooks',
          '@mantine/modals': '@mantine/modals',
          '@mantine/notifications': '@mantine/notifications',
          ahooks: 'ahooks',
          axios: 'axios',
          'crypto-js': 'crypto-js',
          lodash: '_',
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-hook-form': 'react-hook-form',
          'tabler-icons-react': 'tabler-icons-react',
        },
      },
    },
  },
});
