import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { IVizInteractionManager, VizInstance, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils';
import { ClickEchartSeries } from '../cartesian/triggers';
import { getOption } from './option';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';
import { notifyVizRendered } from '../viz-instance-api';

interface IClickEchartsSeries {
  type: 'click';
  seriesType: 'line' | 'scatter' | 'bar';
  componentSubType: 'line' | 'scatter' | 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
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
  conf: IHorizontalBarChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
  instance: VizInstance;
}) {
  const rowDataMap = useRowDataMap(data, conf.y_axis.data_key);

  const triggers = useTriggerSnapshotList<IHorizontalBarChartConf>(
    interactionManager.triggerManager,
    ClickEchartSeries.id,
  );

  const handleSeriesClick = useCallback(
    (params: IClickEchartsSeries) => {
      const rowData = _.get(rowDataMap, params.name, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const echartsInstanceRef = React.useRef<ReactEChartsCore>(null);
  const handleFinished = React.useCallback(() => {
    const chart = echartsInstanceRef.current?.getEchartsInstance();
    if (!chart) return;
    notifyVizRendered(instance, chart.getOption());
  }, [instance]);
  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
      finished: handleFinished,
    };
  }, [handleSeriesClick]);

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

export function VizHorizontalBarChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IHorizontalBarChartConf>(context.instanceData, 'config');
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
