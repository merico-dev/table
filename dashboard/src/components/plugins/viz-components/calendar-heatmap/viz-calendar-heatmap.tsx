import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils';
import { getOption } from './option';
import { ClickCalendarDate } from './triggers';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';

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
  data: TPanelData;
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
  const data = context.data;
  const { width, height } = context.viewport;

  if (!conf.calendar.data_key || !conf.heat_block.data_key) {
    return null;
  }

  if (!width || !height) {
    return null;
  }

  return (
    <DefaultVizBox width={width} height={height}>
      <Chart
        variables={variables}
        width={getBoxContentWidth(width)}
        height={getBoxContentHeight(height)}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />
    </DefaultVizBox>
  );
}
