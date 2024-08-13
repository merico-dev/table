import { useElementSize } from '@mantine/hooks';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils';
import { StatsAroundViz } from '../../common-echarts-fields/stats-around-viz';
import { getOption } from './option';
import { ClickScatterChartSeries } from './triggers';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';

interface IClickScatterChartSeries {
  type: 'click';
  seriesType: 'scatter';
  componentSubType: 'scatter';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
  data: AnyObject;
}

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IScatterChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useRowDataMap(data, conf.x_axis.data_key);

  const triggers = useTriggerSnapshotList<IScatterChartConf>(
    interactionManager.triggerManager,
    ClickScatterChartSeries.id,
  );

  const handleSeriesClick = useCallback(
    (params: IClickScatterChartSeries) => {
      const rowData = params.data;
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
    };
  }, [handleSeriesClick]);

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
      theme="merico-light"
    />
  );
}

export function VizScatterChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IScatterChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;
  const topStats = useElementSize();
  const bottomStats = useElementSize();
  const { ref: topStatsRef, height: topStatsHeight } = topStats;
  const { ref: bottomStatsRef, height: bottomStatsHeight } = bottomStats;

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);

  if (!width || !height) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <StatsAroundViz ref={topStatsRef} value={conf.stats.top} context={context} />

      <Chart
        variables={variables}
        width={finalWidth}
        height={finalHeight}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />

      <StatsAroundViz ref={bottomStatsRef} value={conf.stats.bottom} context={context} />
    </DefaultVizBox>
  );
}
