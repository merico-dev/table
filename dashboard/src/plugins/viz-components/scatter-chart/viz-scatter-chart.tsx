import { Box, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, templateToJSX } from '~/utils/template';
import { getOption } from './option';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';
import { parseDataKey } from '~/utils/data';
import { useRowDataMap } from '~/plugins/hooks/use-row-data-map';

interface IClickScatterChartSeries {
  type: 'click';
  seriesType: 'scatter';
  componentSubType: 'scatter';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
  data: AnyObject;
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
  conf: IScatterChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useRowDataMap(data, conf.x_axis.data_key);

  const triggers = useTriggerSnapshotList<IScatterChartConf>(
    interactionManager.triggerManager,
    ClickScatterChartSeries.id,
  );

  const handleSeriesClick = useCallback(
    (params: IClickScatterChartSeries) => {
      const rowData = params.data;
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
    };
  }, [handleSeriesClick]);

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width, height }}
      onEvents={onEvents}
      notMerge
      theme="merico-light"
    />
  );
}

export function VizScatterChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IScatterChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
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

  if (!width || !height) {
    return null;
  }
  return (
    <Box>
      <Text
        ref={topStatsRef}
        align="left"
        size="xs"
        pl="sm"
        sx={{ display: templateNotEmpty(conf.stats.templates.top) ? 'block' : 'none' }}
      >
        {Object.values(templates.top).map((c) => c)}
      </Text>

      <Chart
        variables={variables}
        width={width}
        height={finalHeight}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />

      <Text
        ref={bottomStatsRef}
        align="left"
        size="xs"
        pl="sm"
        sx={{ display: templateNotEmpty(conf.stats.templates.bottom) ? 'block' : 'none' }}
      >
        {Object.values(templates.bottom).map((c) => c)}
      </Text>
    </Box>
  );
}
