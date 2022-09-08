import { useElementSize } from '@mantine/hooks';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
/* @ts-expect-error type defs of echarts-stat */
import { transform } from 'echarts-stat';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';
import { VizViewProps } from '~/types/plugin';
import { templateToJSX } from '~/utils/template';
import { useStorageData } from '~/plugins/hooks';
import { getOption } from './option';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { Box, Text } from '@mantine/core';

echarts.use([BarChart, LineChart, ScatterChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);
echarts.registerTransform(transform.regression);

function templateNotEmpty(str: string) {
  return str.trim().length > 0;
}

function Chart({
  conf,
  data,
  width,
  height,
}: {
  conf: ICartesianChartConf;
  data: any[];
  width: number;
  height: number;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} />;
}

export function VizCartesianChart({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as any[];
  const { width, height } = context.viewport;
  const { ref: topStatsRef, height: topStatsHeight } = useElementSize();
  const { ref: bottomStatsRef, height: bottomStatsHeight } = useElementSize();
  const templates = React.useMemo(() => {
    const {
      stats: { templates, variables },
    } = conf;
    return {
      top: templateToJSX(templates.top, variables, data),
      bottom: templateToJSX(templates.bottom, variables, data),
    };
  }, [conf, data]);
  const finalHeight = Math.max(0, height - topStatsHeight - bottomStatsHeight);
  return (
    <Box>
      {templateNotEmpty(conf.stats.templates.top) && (
        <Text ref={topStatsRef} align="left" size="xs" pl="sm">
          {Object.values(templates.top).map((c) => c)}
        </Text>
      )}

      <Chart width={width} height={finalHeight} data={data} conf={conf} />

      {templateNotEmpty(conf.stats.templates.bottom) && (
        <Text ref={bottomStatsRef} align="left" size="xs" pl="sm">
          {Object.values(templates.bottom).map((c) => c)}
        </Text>
      )}
    </Box>
  );
}
