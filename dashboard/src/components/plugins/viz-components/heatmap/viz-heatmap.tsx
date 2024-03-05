import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, parseDataKey } from '~/utils';
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

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IHeatmapConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useMemo(() => {
    const x = parseDataKey(conf.x_axis.data_key);
    const y = parseDataKey(conf.y_axis.data_key);
    return _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);
  }, [data, conf.x_axis.data_key, conf.y_axis.data_key]);

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
    return getOption(conf, data, variables, width, height);
  }, [conf, data, width, height]);

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

export function VizHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

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
