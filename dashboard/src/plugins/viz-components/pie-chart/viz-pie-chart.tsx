import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/plugins/hooks';
import { useRowDataMap } from '~/plugins/hooks/use-row-data-map';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { ClickPieChart } from './triggers';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

echarts.use([PieChart, CanvasRenderer]);

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
}: {
  conf: IPieChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
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

  const option = React.useMemo(() => {
    return getOption(conf, data, width);
  }, [conf, data, width]);

  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
    };
  }, [handleSeriesClick]);

  if (!width || !height || !option.series.name) {
    return null;
  }
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
  return <Chart conf={conf} width={width} height={height} data={data} interactionManager={interactionManager} />;
}
