import type { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import { useLatest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils';
import { StatsAroundViz } from '../../common-echarts-fields/stats-around-viz';
import { getOption } from './option';
import { updateRegressionLinesColor } from './option/events';
import { ClickEchartSeries } from './triggers/click-echart';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';

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
  onChartRenderFinished,
}: {
  conf: ICartesianChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
  onChartRenderFinished: (chartOptions: unknown) => void;
}) {
  const rowDataMap = useRowDataMap(data, conf.x_axis_data_key);

  const triggers = useTriggerSnapshotList<ICartesianChartConf>(interactionManager.triggerManager, ClickEchartSeries.id);

  const handleSeriesClick = useCallback(
    (params: IClickEchartsSeries) => {
      const rowData = _.get(rowDataMap, params.name, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  const echartsRef = React.useRef<EChartsInstance>();
  const onRenderFinishedRef = useLatest(onChartRenderFinished);
  const handleEChartsFinished = useCallback(() => {
    onRenderFinishedRef.current(echartsRef.current?.getOption());
  }, []);
  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
      finished: handleEChartsFinished,
    };
  }, [handleSeriesClick]);

  const handleChartReady = (echartsInstance: EChartsInstance) => {
    echartsRef.current = echartsInstance;
    updateRegressionLinesColor(echartsInstance);
  };
  useEffect(() => {
    if (echartsRef.current) {
      updateRegressionLinesColor(echartsRef.current);
    }
  }, [option]);

  if (!width || !height) {
    return null;
  }
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width, height }}
      onEvents={onEvents}
      onChartReady={handleChartReady}
      notMerge
      theme="merico-light"
    />
  );
}

export const VizCartesianChart = observer(({ context, instance }: VizViewProps) => {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;
  const [topStatsHeight, setTopStatsHeight] = useState(0);
  const [bottomStatsHeight, setBottomStatsHeight] = useState(0);

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);

  function handleChartRenderFinished(chartOptions: unknown) {
    instance.messageChannels.getChannel('viz').emit('rendered', chartOptions);
  }

  return (
    <DefaultVizBox width={width} height={height}>
      <StatsAroundViz onHeightChange={setTopStatsHeight} value={conf.stats.top} context={context} />

      <Chart
        onChartRenderFinished={handleChartRenderFinished}
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
});
