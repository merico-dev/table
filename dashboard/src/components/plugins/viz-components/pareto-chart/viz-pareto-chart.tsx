import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '../../hooks';
import { notifyVizRendered } from '../viz-instance-api';
import { getOption } from './option';
import { ClickParetoSeries } from './triggers';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

interface IClickParetoSeries {
  type: 'click';
  seriesType: 'line' | 'bar';
  componentSubType: 'line' | 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, number];
}

export function VizParetoChart({ context, instance }: VizViewProps) {
  // options
  const { variables } = context;
  const { value: confValue } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  const data = context.data;
  const { width, height } = context.viewport;
  const conf = defaults({}, confValue, DEFAULT_CONFIG);
  const option = getOption(conf, data, variables);

  // interactions
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IParetoChartConf>(interactionManager.triggerManager, ClickParetoSeries.id);

  const rowDataMap = useRowDataMap(data, conf.x_axis.data_key);

  const handleSeriesClick = useCallback(
    (params: IClickParetoSeries) => {
      const rowData = _.get(rowDataMap, params.name, { error: 'rowData is not found' });
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
      click: handleSeriesClick,
      finished: handleFinished,
    };
  }, [handleSeriesClick, handleFinished]);

  if (!conf || !width || !height) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        ref={echartsInstanceRef}
        style={getBoxContentStyle(width, height)}
        onEvents={onEvents}
        notMerge
        theme="merico-light"
      />
    </DefaultVizBox>
  );
}
