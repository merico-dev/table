import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import {
  CalendarComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
import { getOption } from './option';
import { ClickCalendarDate } from './triggers';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';
import { useRowDataMap } from '~/plugins/hooks/use-row-data-map';

echarts.use([
  DataZoomComponent,
  BarChart,
  LineChart,
  HeatmapChart,
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

interface IClickCalendarDate {
  type: 'click';
  seriesType: 'heatblock';
  componentSubType: 'heatblock';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, string, string];
  rowData: AnyObject;
}

function handleLegendSelected({ name }: { name: string }, instance: any) {
  const option = instance.getOption();
  // actually just 1 calendar
  option.calendar.forEach((c: any) => {
    c.range = name;
  });
  instance.setOption(option);
}

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: ICalendarHeatmapConf;
  data: TVizData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useRowDataMap(data, conf.calendar.data_key);

  const triggers = useTriggerSnapshotList<ICalendarHeatmapConf>(
    interactionManager.triggerManager,
    ClickCalendarDate.id,
  );

  const handleHeatBlockClick = useCallback(
    (params: IClickCalendarDate) => {
      const [date, value] = params.value;
      const rowData = _.get(rowDataMap, date, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleHeatBlockClick,
      legendselectchanged: handleLegendSelected,
    };
  }, [handleHeatBlockClick]);

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
      onEvents={onEvents}
      notMerge
      opts={{ locale: conf.calendar.locale }}
      theme="merico-light"
    />
  );
}

export function VizCalendarHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<ICalendarHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;

  if (!conf.calendar.data_key || !conf.heat_block.data_key) {
    return null;
  }

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
