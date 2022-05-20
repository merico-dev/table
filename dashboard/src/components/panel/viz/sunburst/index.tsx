import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { SunburstChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";

echarts.use([SunburstChart, CanvasRenderer]);

interface ISunbrust {
  conf: any;
  data: any[];
  width: number;
  height: number;
}

const defaultOption = {
  tooltip: {
    show: true
  },
  series: {
    type: "sunburst",
    radius: [
      0,
      "90%"
    ],
    emphasis: {
      focus: "ancestor"
    }
  }
};

export function Sunbrust({ conf, data, width, height }: ISunbrust) {
  const max = _.maxBy(data, d => d.value).value ?? 1;
  const labelOption = {
    series: {
      label: {
        formatter: ({ name, value }: any) => {
          if (value / max < 0.2) {
            return ' ';
          }
          return name;
        }
      }
    }
  };
  const option = _.defaultsDeep(defaultOption, labelOption, conf, { series: { data } });

  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
  )
}