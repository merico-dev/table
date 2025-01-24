import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { IVizInteractionManager, VizInstance, VizViewProps } from '~/types/plugin';
import { notifyVizRendered } from '../viz-instance-api';
import { getOption } from './option';
import { ClickPieChart } from './triggers';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

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
  instance,
}: {
  conf: IPieChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  instance: VizInstance;
}) {
  const rowDataMap = useRowDataMap(data, conf.label_field);

  const triggers = useTriggerSnapshotList<IPieChartConf>(interactionManager.triggerManager, ClickPieChart.id);

  const handleSeriesClick = React.useCallback(
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

  const option = React.useMemo(() => {
    return getOption(conf, data, width);
  }, [conf, data, width]);

  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
      finished: handleFinished,
    };
  }, [handleSeriesClick, handleFinished]);

  if (!width || !height || !option.series.name) {
    return null;
  }
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

export function VizPieChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const { value: confValue } = useStorageData<IPieChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  if (!width || !height) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <Chart
        instance={instance}
        conf={conf}
        width={getBoxContentWidth(width)}
        height={getBoxContentHeight(height)}
        data={data}
        interactionManager={interactionManager}
      />
    </DefaultVizBox>
  );
}
