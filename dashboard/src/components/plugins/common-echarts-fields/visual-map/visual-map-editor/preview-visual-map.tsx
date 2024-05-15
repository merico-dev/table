import { Divider, Stack } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { VisualMap } from '../types';
import { getVisualMap } from '../utils';

// it's buggy, will put into use later
export const PreviewVisualMap = ({
  visualMap,
  variableValueMap,
}: {
  visualMap: VisualMap;
  variableValueMap: Record<string, any>;
}) => {
  const { orient, itemWidth, itemHeight, text } = visualMap;
  const isHorizontal = orient === 'horizontal';
  const renderHeight = isHorizontal ? itemWidth : itemHeight;

  const options = { visualMap: getVisualMap(visualMap, variableValueMap) };
  return (
    <Stack>
      <ReactEChartsCore
        echarts={echarts}
        option={options}
        style={{ width: '100%', height: `${renderHeight + 40}px` }}
        notMerge
        theme="merico-light"
      />
      <Divider variant="dashed" />
    </Stack>
  );
};
