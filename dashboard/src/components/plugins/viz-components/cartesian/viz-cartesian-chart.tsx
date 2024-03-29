import { Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import type { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, templateToJSX } from '~/utils';
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

function templateNotEmpty(str: string) {
  return str.trim().length > 0;
}

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: ICartesianChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
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
  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
    };
  }, [handleSeriesClick]);

  const onChartReady = (echartsInstance: EChartsInstance) => {
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
      onChartReady={onChartReady}
      notMerge
      theme="merico-light"
    />
  );
}

export function VizCartesianChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;
  const { ref: topStatsRef, height: topStatsHeight } = useElementSize();
  const { ref: bottomStatsRef, height: bottomStatsHeight } = useElementSize();
  const templates = React.useMemo(() => {
    const {
      stats: { templates },
    } = conf;
    return {
      top: templateToJSX(templates.top, variables, data),
      bottom: templateToJSX(templates.bottom, variables, data),
    };
  }, [conf, data]);

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);
  return (
    <DefaultVizBox width={width} height={height}>
      <Text
        ref={topStatsRef}
        align="left"
        size="xs"
        pl="sm"
        sx={{ display: templateNotEmpty(conf.stats.templates.top) ? 'block' : 'none' }}
      >
        {Object.values(templates.top).map((c, i) => (
          <React.Fragment key={i}>{c}</React.Fragment>
        ))}
      </Text>

      <Chart
        variables={variables}
        width={finalWidth}
        height={finalHeight}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />

      <Text
        ref={bottomStatsRef}
        align="left"
        size="xs"
        pl="sm"
        sx={{ display: templateNotEmpty(conf.stats.templates.bottom) ? 'block' : 'none' }}
      >
        {Object.values(templates.bottom).map((c, i) => (
          <React.Fragment key={i}>{c}</React.Fragment>
        ))}
      </Text>
    </DefaultVizBox>
  );
}
