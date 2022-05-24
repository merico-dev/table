import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
      name: 'dashboard',
      formats: ['es', 'umd'],
      fileName: (format) => `dashboard.${format}.js`,
    },
    rollupOptions: {
      external: [
        '@mantine/core',
        '@mantine/dates',
        '@mantine/form',
        '@mantine/hooks',
        '@mantine/notifications',
        '@mantine/prism',
        'axios',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'echarts-for-react',
        'echarts-gl',
        'lodash',
        'numbro',
        'react',
        'react-dom',
        'tabler-icons-react',
      ],
      output: {
        globals: {
          '@mantine/core': '@mantine/core',
          '@mantine/dates': '@mantine/dates',
          '@mantine/form': '@mantine/form',
          '@mantine/hooks': '@mantine/hooks',
          '@mantine/notifications': '@mantine/notifications',
          '@mantine/prism': '@mantine/prism',
          'axios': 'axios',
          'echarts/core': 'echarts/core',
          'echarts/charts': 'echarts/charts',
          'echarts/components': 'echarts/components',
          'echarts/renderers': 'echarts/renderers',
          'echarts-for-react': 'echarts-for-react',
          'echarts-gl': 'echarts-gl',
          lodash: '_',
          numbro: 'numbro',
          react: 'React',
          'react-dom': 'ReactDOM',
          'tabler-icons-react': 'tabler-icons-react',
        },
      },
    },
  },
});