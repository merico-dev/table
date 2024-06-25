import { Divider, Stack } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { VisualMap } from '../types';
import { getVisualMap } from '../utils';
import { useEditPanelContext } from '~/contexts';
import { ErrorBoundary } from '~/utils';

// it's buggy, will put into use later
export const PreviewVisualMap = ({ visualMap }: { visualMap: VisualMap }) => {
  const { orient, itemWidth, itemHeight } = visualMap;
  const isHorizontal = orient === 'horizontal';
  const renderHeight = isHorizontal ? itemWidth : itemHeight;
  const { panel } = useEditPanelContext();

  const visualMapOption = getVisualMap(visualMap, panel.variableValueMap);
  return (
    <ErrorBoundary>
      <ReactEChartsCore
        echarts={echarts}
        option={{ visualMap: visualMapOption }}
        style={{ width: '100%', height: `${renderHeight + 40}px` }}
        notMerge
        theme="merico-light"
      />
    </ErrorBoundary>
  );
};
