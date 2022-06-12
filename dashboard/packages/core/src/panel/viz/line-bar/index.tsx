import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';
import numbro from 'numbro';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';

echarts.use([BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const defaultOption = {
  legend: {
    show: true
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {},
  grid: {
    top: 30,
    left: 10,
    right: 10,
    bottom: 10,
    containLabel: true,
  }
}

interface ILineBarChart {
  conf: any;
  data: any[];
  width: number;
  height: number;
}

export function VizLineBarChart({ conf, data, width, height }: ILineBarChart) {
  const option = React.useMemo(() => {
    const valueFormatters = conf.series.reduce((ret: Record<string, (params: any) => string>, { name, y_axis_data_formatter }: any) => {
      ret[name] = function formatter({ value }: any) {
        if (!y_axis_data_formatter) {
          return value;
        }
        try {
          return numbro(value).format(JSON.parse(y_axis_data_formatter))
        } catch (error) {
          console.error(error)
          return value;
        }
      }
      return ret;
    }, {});

    const series = conf.series.map(({ y_axis_data_key, y_axis_data_formatter, name, label_position = 'top', ...rest }: any) => {
      const ret = {
        data: data.map((d) => d[y_axis_data_key]),
        label: {
          show: true,
          position: label_position,
        },
        name,
        ...rest,
      }
      if (y_axis_data_formatter) {
        ret.label.formatter = valueFormatters[name]
      }
      return ret;
    });

    const customOptions = {
      xAxis: {
        data: data.map((d) => d[conf.x_axis_data_key]),
      },
      dataset: { source: data },
      series,
      tooltip: {
        formatter: function (params: TopLevelFormatterParams) {
          const arr = Array.isArray(params) ? params : [params];
          if (arr.length === 0) {
            return ''
          }
          const lines = arr.map(({ seriesName, value }) => {
            if (!seriesName) {
              return value;
            }
            return `${seriesName}: ${valueFormatters[seriesName]({ value })}`
          })
          lines.unshift(`<strong>${arr[0].name}</strong>`)
          return lines.join('<br />')
        }
      }
    }
    return _.assign({}, defaultOption, customOptions);
  }, [conf, data])

  if (!width || !height) {
    return null;
  }
  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}