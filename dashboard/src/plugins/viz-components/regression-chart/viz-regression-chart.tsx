import { Box } from '@mantine/core';
import { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { ScatterChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaultsDeep } from 'lodash';
import { useMemo, useState } from 'react';
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

  const [echartsInstance, setEchartsInstance] = useState<EChartsInstance | null>(null);
  const onChartReady = (echartsInstance: EChartsInstance) => {
    setEchartsInstance(echartsInstance);
  };

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <Toolbox conf={conf} data={data} />
      <ReactEChartsCore
        echarts={echarts}
        onChartReady={onChartReady}
        option={option}
        style={{ width: width, height }}
        notMerge
        theme="merico-light"
      />
    </Box>
  );
}
