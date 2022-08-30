import ReactEChartsCore from 'echarts-for-react/lib/core';
import { SunburstChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults, maxBy, merge } from 'lodash';
import { useMemo } from 'react';

import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, ISunburstConf } from './type';

echarts.use([SunburstChart, CanvasRenderer]);

const defaultOption = {
  tooltip: {
    show: true,
  },
  series: {
    type: 'sunburst',
    radius: [0, '90%'],
    emphasis: {
      focus: 'ancestor',
    },
  },
};

export function VizSunburst({ context }: VizViewProps) {
  const { value: conf } = useStorageData<ISunburstConf>(context.instanceData, 'config');

  const data = context.data as any[];
  const { width, height } = context.viewport;
  const { label_field, value_field } = defaults({}, conf, DEFAULT_CONFIG);

  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: d[label_field],
      value: Number(d[value_field]),
    }));
  }, [data, label_field, value_field]);
  const max = useMemo(() => maxBy(chartData, (d) => d.value)?.value ?? 1, [chartData]);
  const labelOption = useMemo(
    () => ({
      series: {
        label: {
          formatter: ({ name, value }: any) => {
            if (value / max < 0.2) {
              return ' ';
            }
            return name;
          },
        },
      },
    }),
    [max],
  );
  const option = merge({}, defaultOption, labelOption, { series: { data: chartData } });

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}
