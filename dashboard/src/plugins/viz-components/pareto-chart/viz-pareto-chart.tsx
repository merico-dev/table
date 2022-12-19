import _ from 'lodash';
import { defaults } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart } from 'echarts/charts';
import numbro from 'numbro';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { ClickEchartSeries } from '../cartesian/triggers';
import { ClickParetoSeries } from './triggers';

function formatPercentage(value: number) {
  return numbro(value).format({
    output: 'percent',
    mantissa: 0,
  });
}

function formatterForLine(payload: $TSFixMe) {
  const value = payload.value[1];
  try {
    return formatPercentage(value);
  } catch (error) {
    console.error(error);
    return value;
  }
}

function tooltipFormatter(params: TopLevelFormatterParams) {
  const arr = Array.isArray(params) ? params : [params];
  if (arr.length === 0) {
    return '';
  }
  const lines = arr.map((row, index) => {
    const seriesName = row.seriesName;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_x, value] = row.value as [string, number];
    if (!seriesName) {
      return value;
    }
    const formatter = index === 0 ? (v: number) => v : formatPercentage;
    return `${seriesName}: <strong>${formatter(value as number)}</strong>`;
  });
  lines.unshift(`<strong>${arr[0].name}</strong>`);
  return lines.join('<br />');
}

echarts.use([BarChart, LineChart, DataZoomComponent, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

interface IClickParetoSeries {
  type: 'click';
  seriesType: 'line' | 'bar';
  componentSubType: 'line' | 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, number];
}

export function VizParetoChart({ context, instance }: VizViewProps) {
  // interactions
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IParetoChartConf>(interactionManager.triggerManager, ClickParetoSeries.id);

  const handleSeriesClick = (params: IClickParetoSeries) => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, { ...params });
    });
  };

  // options
  const { value: conf } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;
  const { x_axis, data_key, bar, line } = defaults({}, conf, DEFAULT_CONFIG);

  const { barData, lineData } = useMemo(() => {
    const barData = data.map((d) => [d[x_axis.data_key], Number(d[data_key])]).sort((a, b) => b[1] - a[1]);
    const sum = barData.reduce((sum, curr) => sum + curr[1], 0);
    const lineData = barData
      .reduce((ret, curr, index) => {
        const prevValue = index === 0 ? 0 : ret[index - 1][1];
        ret.push([curr[0], prevValue + curr[1]]);
        return ret;
      }, [] as [$TSFixMe, number][])
      .map((row) => [row[0], row[1] / sum]);
    return {
      barData,
      lineData,
    };
  }, [x_axis.data_key, data_key, data]);

  const option = {
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
      },
      {
        type: 'inside',
        yAxisIndex: [0],
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter,
    },
    xAxis: [
      {
        type: 'category',
        name: x_axis.name,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
          align: 'right',
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        name: bar.name,
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
          align: 'right',
        },
        axisLine: {
          show: true,
        },
        splitLine: {
          show: false,
        },
      },
      {
        name: line.name,
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
          align: 'center',
        },
        axisLabel: {
          show: true,
          formatter: formatPercentage,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: bar.name,
        type: 'bar',
        itemStyle: {
          color: bar.color,
        },
        yAxisIndex: 0,
        data: barData,
      },
      {
        name: line.name,
        type: 'line',
        itemStyle: {
          color: line.color,
        },
        symbolSize: 2,
        lineStyle: {
          width: 1,
        },
        label: {
          show: true,
          position: 'top',
          formatter: formatterForLine,
        },
        yAxisIndex: 1,
        data: lineData,
      },
    ],
  };
  if (!conf || !width || !height) {
    return null;
  }
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width, height }}
      onEvents={{ click: handleSeriesClick }}
    />
  );
}
