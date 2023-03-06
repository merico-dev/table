import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
/* @ts-expect-error type defs of echarts-stat */
import { transform } from 'echarts-stat';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
import { getOption } from './option';
import { ClickHeatBlock } from './triggers';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

interface IClickHeatBlock {
  type: 'click';
  seriesType: 'heatblock';
  componentSubType: 'heatblock';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, string, string];
  rowData: AnyObject;
}

echarts.use([
  DataZoomComponent,
  BarChart,
  LineChart,
  HeatmapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);
echarts.registerTransform(transform.regression);

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IHeatmapConf;
  data: $TSFixMe[];
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useMemo(() => {
    const xKey = conf.x_axis.data_key;
    const yKey = conf.y_axis.data_key;
    return _.keyBy(data, (i) => `${i[xKey]}---${i[yKey]}`);
  }, [data, conf.x_axis.data_key]);

  const triggers = useTriggerSnapshotList<IHeatmapConf>(interactionManager.triggerManager, ClickHeatBlock.id);

  const handleHeatBlockClick = useCallback(
    (params: IClickHeatBlock) => {
      const [x, y] = params.value;
      const rowData = _.get(rowDataMap, `${x}---${y}`, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleHeatBlockClick,
    };
  }, [handleHeatBlockClick]);

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} onEvents={onEvents} notMerge />;
}

export function VizHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;

  return (
    <Box>
      <Chart
        variables={variables}
        width={width}
        height={height}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />
    </Box>
  );
}
