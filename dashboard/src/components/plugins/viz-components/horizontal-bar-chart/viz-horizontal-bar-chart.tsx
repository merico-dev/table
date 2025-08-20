import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
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
import { StatsAroundViz } from '../../common-echarts-fields/stats-around-viz';

type ClickSeriesParamsType = {
  type: 'click';
  seriesType: 'bar';
  componentSubType: 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
};

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
    (params: ClickSeriesParamsType) => {
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

  if (!width || !height) {
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
  const [topStatsHeight, setTopStatsHeight] = useState(0);
  const [bottomStatsHeight, setBottomStatsHeight] = useState(0);

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);

  return (
    <DefaultVizBox width={width} height={height}>
      <StatsAroundViz onHeightChange={setTopStatsHeight} value={conf.stats.top} context={context} />
      <Chart
        instance={instance}
        variables={variables}
        width={finalWidth}
        height={finalHeight}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />
      <StatsAroundViz onHeightChange={setBottomStatsHeight} value={conf.stats.bottom} context={context} />
    </DefaultVizBox>
  );
}
