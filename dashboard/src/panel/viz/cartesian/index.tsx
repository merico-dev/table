import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
/* @ts-expect-error */
import { transform } from 'echarts-stat';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _ from "lodash";
import React from 'react';
import { getOption } from './option';
import { ICartesianChartConf } from './type';
import { templateToJSX } from '../../../utils/template/render';
import { Box, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

echarts.use([BarChart, LineChart, ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
echarts.registerTransform(transform.regression);

function templateNotEmpty(str: string) {
  return str.trim().length > 0;
}

interface ICartesianChart {
  conf: ICartesianChartConf;
  data: any[];
  width: number;
  height: number;
}

function Chart({ conf, data, width, height }: ICartesianChart) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data])

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />
}

export function VizCartesianChart({ conf, data, width, height }: ICartesianChart) {
  const { ref: topStatsRef, height: topStatsHeight } = useElementSize();
  const { ref: bottomStatsRef, height: bottomStatsHeight } = useElementSize();

  const templates = React.useMemo(() => {
    const { stats: { templates, variables } } = conf;
    return {
      top: templateToJSX(templates.top, variables, data),
      bottom: templateToJSX(templates.bottom, variables, data),
    };
  }, [conf, data])

  const finalHeight = Math.max(0, height - topStatsHeight - bottomStatsHeight);
  return (
    <Box>
      {templateNotEmpty(conf.stats.templates.top) && (
        <Text ref={topStatsRef} align='left' size='xs' pl="sm">{Object.values(templates.top).map(c => c)}</Text>
      )}

      <Chart width={width} height={finalHeight} data={data} conf={conf} />

      {templateNotEmpty(conf.stats.templates.bottom) && (
        <Text ref={bottomStatsRef} align='left' size='xs' pl="sm">{Object.values(templates.bottom).map(c => c)}</Text>
      )}
    </Box>
  )
}