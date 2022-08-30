import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep, isEmpty } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { getOption } from './option';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

echarts.use([RadarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export function VizRadarChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;
  const data = context.data as any[];
  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data);
  }, [conf, data]);

  if (!width || !height || !conf || isEmpty(conf?.dimensions)) {
    return null;
  }
  return (
    <Box>
      <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
    </Box>
  );
}
