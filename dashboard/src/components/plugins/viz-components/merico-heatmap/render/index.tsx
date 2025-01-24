import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizInstance, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, parseDataKey } from '~/utils';
import { notifyVizRendered } from '../../viz-instance-api';
import { ClickHeatBlock } from '../triggers';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from '../type';
import { getOption } from './option';

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
  instance,
}: {
  conf: TMericoHeatmapConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
  instance: VizInstance;
}) {
  const rowDataMap = useMemo(() => {
    const x = parseDataKey(conf.x_axis.data_key);
    const y = parseDataKey(conf.y_axis.data_key);
    return _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);
  }, [data, conf.x_axis.data_key, conf.y_axis.data_key]);

  const triggers = useTriggerSnapshotList<TMericoHeatmapConf>(interactionManager.triggerManager, ClickHeatBlock.id);

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

  const echartsInstanceRef = React.useRef<ReactEChartsCore>(null);
  const handleFinished = useCallback(() => {
    const chart = echartsInstanceRef.current?.getEchartsInstance();
    if (!chart) return;
    notifyVizRendered(instance, chart.getOption());
  }, [instance]);
  const onEvents = useMemo(() => {
    return {
      click: handleHeatBlockClick,
      finished: handleFinished,
    };
  }, [handleHeatBlockClick, handleFinished]);

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      ref={echartsInstanceRef}
      style={{ width, height }}
      onEvents={onEvents}
      notMerge
      theme="merico-light"
    />
  );
}

export function RenderMericoHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<TMericoHeatmapConf>(context.instanceData, 'config');
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
        instance={instance}
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
