import { Divider, Stack } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { VisualMap } from '../types';

export const PreviewVisualMap = ({ visualMap }: { visualMap: VisualMap }) => {
  const { orient, itemWidth, itemHeight } = visualMap;
  const isHorizontal = orient === 'horizontal';
  const renderHeight = isHorizontal ? itemWidth : itemHeight;

  const options = JSON.parse(JSON.stringify({ visualMap }));
  return (
    <Stack>
      <ReactEChartsCore
        echarts={echarts}
        option={options}
        style={{ width: '100%', height: `${renderHeight + 20}px` }}
        notMerge
        theme="merico-light"
      />
      <Divider />
    </Stack>
  );
};
