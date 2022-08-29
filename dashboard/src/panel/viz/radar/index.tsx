import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import React from 'react';
import { getOption } from './option';
import { IRadarChartConf } from './type';

echarts.use([RadarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

interface IRadarChart {
  conf: IRadarChartConf;
  data: any[];
  width: number;
  height: number;
}

function Chart({ conf, data, width, height }: IRadarChart) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}

export function VizRadarChart({ conf, data, width, height }: IRadarChart) {
  return (
    <Box>
      <Chart width={width} height={height} data={data} conf={conf} />
    </Box>
  );
}
