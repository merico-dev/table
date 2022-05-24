import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import visualizer from 'rollup-plugin-visualizer'

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
      plugins: [
        visualizer()
      ],
      external: [
        '@mantine/core',
        '@mantine/dates',
        '@mantine/form',
        '@mantine/hooks',
        '@mantine/notifications',
        '@mantine/prism',
        'ahooks',
        'axios',
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'echarts-for-react/lib/core',
        'echarts-gl',
        'lodash',
        'numbro',
        'react',
        'react-dom',
        'react-grid-layout',
        'react-hook-form',
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
          ahooks: 'ahooks',
          'axios': 'axios',
          'echarts/core': 'echarts/core',
          'echarts/charts': 'echarts/charts',
          'echarts/components': 'echarts/components',
          'echarts/renderers': 'echarts/renderers',
          'echarts-for-react/lib/core': 'echarts-for-react/lib/core',
          'echarts-gl': 'echarts-gl',
          lodash: '_',
          numbro: 'numbro',
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-grid-layout': 'react-grid-layout',
          'react-hook-form': 'react-hook-form',
          'tabler-icons-react': 'tabler-icons-react',
        },
      },
    },
  },
});