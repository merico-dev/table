import 'echarts-gl';
import * as echarts from 'echarts/core';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { defaults, get, maxBy, minBy } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IBar3dChartConf } from './type';

echarts.use([GridComponent, VisualMapComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export function VizBar3dChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IBar3dChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;
  const { x_axis_data_key, y_axis_data_key, z_axis_data_key, xAxis3D, yAxis3D, zAxis3D } = defaults(
    {},
    conf,
    DEFAULT_CONFIG,
  );

  const min = useMemo(() => {
    const minValue = minBy(data, (d) => d[z_axis_data_key]);
    return get(minValue, z_axis_data_key);
  }, [data, z_axis_data_key]);

  const max = useMemo(() => {
    const maxValue = maxBy(data, (d) => d[z_axis_data_key]);
    return get(maxValue, z_axis_data_key);
  }, [data, z_axis_data_key]);

  const option = {
    tooltip: {},
    backgroundColor: '#fff',
    visualMap: {
      show: true,
      dimension: 2,
      min,
      max,
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
    },
    xAxis3D,
    yAxis3D,
    zAxis3D,
    grid3D: {
      viewControl: {
        projection: 'orthographic',
        autoRotate: false,
      },
      light: {
        main: {
          shadow: true,
          quality: 'ultra',
          intensity: 1.5,
        },
      },
    },
    series: [
      {
        type: 'bar3D',
        wireframe: {
          // show: false
        },
        data: data.map((d) => [d[x_axis_data_key], d[y_axis_data_key], d[z_axis_data_key]]),
      },
    ],
  };

  if (!conf) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}
