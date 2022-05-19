import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { SunburstChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";

echarts.use([SunburstChart, CanvasRenderer]);

interface ISunbrust {
  conf: any;
  data: any;
  width: number;
  height: number;
}

export function Sunbrust({ conf, data, width, height }: ISunbrust) {
  const option = {
    "color": [
      "#7cbadd",
      "#f3b7d2",
      "#7cd6d6",
      "#bcda96",
      "#d0bd79",
      "#dcbfcc",
      "#fbdd8b",
      "#e692b5",
      "#f9be78",
      "#44c1e9",
      "#ee9d83",
      "#a2dff5",
      "#ec7373",
      "#ac87dd",
      "#ffd2ad",
      "#ceb7ec",
      "#7bb3b3",
      "#fdbcac",
      "#9fd2b6",
      "#d3ba9b"
    ],
    "series": {
      "type": "sunburst",
      "radius": [
        0,
        "90%"
      ],
      "emphasis": {
        "focus": "ancestor"
      },
      "data": data
    }
  };
  return (
    <ReactEChartsCore echarts={echarts} option={option} style={{ width, height}} />
  )
}