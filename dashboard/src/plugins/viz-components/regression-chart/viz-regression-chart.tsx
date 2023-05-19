import { Box, Group } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { ScatterChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { Toolbox } from './toolbox';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

echarts.use([DataZoomComponent, ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export function VizRegressionChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;

  // convert strings as numbers
  const data = useMemo(() => {
    const rawData = context.data as $TSFixMe[];
    const key = conf?.regression?.y_axis_data_key;
    if (!key) {
      return rawData;
    }
    return rawData.map((row) => {
      if (typeof row[key] === 'number') {
        return row;
      }
      return {
        ...row,
        [key]: Number(row[key]),
      };
    });
  }, [context.data, conf?.regression.y_axis_data_key]);

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data);
  }, [conf, data]);

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <Box>
      <Toolbox conf={conf} data={data} />
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ width: width, height: height - 30 }}
        notMerge
        theme="merico-light"
      />
    </Box>
  );
}
