import ReactEChartsCore from 'echarts-for-react/lib/core';
import 'echarts-gl';
import * as echarts from 'echarts/core';
import { defaults, get, maxBy, minBy } from 'lodash';
import { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { DefaultVizBox, getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { extractFullQueryData, parseDataKey } from '~/utils';
import { DEFAULT_CONFIG, IBar3dChartConf } from './type';

const paddings = {
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
};

export function VizBar3dChart({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IBar3dChartConf>(context.instanceData, 'config');
  const data = context.data;
  const { width, height } = context.viewport;
  const { x_axis_data_key, y_axis_data_key, z_axis_data_key, xAxis3D, yAxis3D, zAxis3D } = defaults(
    {},
    conf,
    DEFAULT_CONFIG,
  );
  const queryData = useMemo(() => extractFullQueryData(data, x_axis_data_key), [data, x_axis_data_key]);

  const { x, y, z } = useMemo(() => {
    return {
      x: parseDataKey(x_axis_data_key),
      y: parseDataKey(y_axis_data_key),
      z: parseDataKey(z_axis_data_key),
    };
  }, [x_axis_data_key, y_axis_data_key, z_axis_data_key]);

  const { min, max } = useMemo(() => {
    const minValue = minBy(queryData, (d) => d[z.columnKey]);
    const maxValue = maxBy(queryData, (d) => d[z.columnKey]);
    return {
      min: get(minValue, z.columnKey),
      max: get(maxValue, z.columnKey),
    };
  }, [queryData, z]);

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
        data: queryData.map((d) => [d[x.columnKey], d[y.columnKey], d[z.columnKey]]),
      },
    ],
  };

  if (!conf) {
    return null;
  }

  return (
    <DefaultVizBox width={width} height={height}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={getBoxContentStyle(width, height)}
        notMerge
        theme="merico-light"
      />
    </DefaultVizBox>
  );
}
