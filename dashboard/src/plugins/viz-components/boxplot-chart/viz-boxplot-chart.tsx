import ReactEChartsCore from 'echarts-for-react/lib/core';
import 'echarts-gl';
import { BoxplotChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';

echarts.use([BoxplotChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export function VizBoxplotChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const data = context.data as any[];
  const { width, height } = context.viewport;
  const { x_axis, y_axis, color } = defaults({}, conf, DEFAULT_CONFIG);

  const { xAxisData, boxplotData } = useMemo(() => {
    const grouped = _.groupBy(data, x_axis.data_key);
    return {
      xAxisData: Object.keys(grouped),
      boxplotData: Object.values(grouped).map((group) => group.map((item) => item[y_axis.data_key])),
    };
  }, [data, x_axis.data_key, y_axis.data_key]);

  const option = {
    dataset: [
      {
        source: boxplotData,
      },
      {
        transform: {
          type: 'boxplot',
          config: {
            itemNameFormatter: function (params: { value: number }) {
              return xAxisData[params.value] ?? params.value;
            },
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        name: x_axis.name,
      },
    ],
    yAxis: [
      {
        name: y_axis.name,
      },
    ],
    series: [
      {
        name: y_axis.name,
        type: 'boxplot',
        itemStyle: {
          color,
          borderColor: '#454545',
        },
        boxWidth: [10, 40],
        datasetIndex: 1,
      },
    ],
  };

  if (!conf) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}
