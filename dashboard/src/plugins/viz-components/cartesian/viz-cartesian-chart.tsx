import { useElementSize } from '@mantine/hooks';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { Box, Text } from '@mantine/core';
/* @ts-expect-error type defs of echarts-stat */
import { transform } from 'echarts-stat';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';
<<<<<<< HEAD
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
=======
import { VizViewProps } from '~/types/plugin';
import { ITemplateVariable, templateToJSX } from '~/utils/template';
>>>>>>> c08ba05 (chore(dashboard): make cartesian chart use variables from panel config)
import { useStorageData } from '~/plugins/hooks';
import { ITriggerSnapshot, IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { templateToJSX } from '~/utils/template';
import { getOption } from './option';
import { ClickEchartSeries } from './triggers/click-echart';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { EChartsInstance } from 'echarts-for-react';
import _ from 'lodash';

interface IClickEchartsSeries {
  type: 'click';
  seriesType: 'line' | 'scatter' | 'bar';
  componentSubType: 'line' | 'scatter' | 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
}

echarts.use([
  DataZoomComponent,
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  MarkLineComponent,
  MarkAreaComponent,
]);
echarts.registerTransform(transform.regression);

function templateNotEmpty(str: string) {
  return str.trim().length > 0;
}

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: ICartesianChartConf;
  data: $TSFixMe[];
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const triggers = useTriggerSnapshotList<ICartesianChartConf>(interactionManager.triggerManager, ClickEchartSeries.id);

  const handleSeriesClick = (params: IClickEchartsSeries) => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, { ...params });
    });
  };

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  if (!width || !height) {
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

export function VizCartesianChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;
  const { ref: topStatsRef, height: topStatsHeight } = useElementSize();
  const { ref: bottomStatsRef, height: bottomStatsHeight } = useElementSize();
  const templates = React.useMemo(() => {
    const {
      stats: { templates },
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

      <Chart variables={variables} width={width} height={finalHeight} data={data} conf={conf} interactionManager={interactionManager}/>

      {templateNotEmpty(conf.stats.templates.bottom) && (
        <Text ref={bottomStatsRef} align="left" size="xs" pl="sm">
          {Object.values(templates.bottom).map((c) => c)}
        </Text>
      )}
    </Box>
  );
}
