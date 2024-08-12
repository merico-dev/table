import { useElementSize } from '@mantine/hooks';
import type { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { ReadonlyRichText } from '~/components/widgets';
import { useRenderContentModelContext, useRenderPanelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, parseRichTextContent } from '~/utils';
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

export const VizCartesianChart = observer(({ context, instance }: VizViewProps) => {
  const contentModel = useRenderContentModelContext();
  const { panel } = useRenderPanelContext();
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
  const statsContent = React.useMemo(() => {
    const { stats } = conf;
    return {
      top: parseRichTextContent(stats.top, variables, contentModel.payloadForViz, data),
      bottom: parseRichTextContent(stats.bottom, variables, contentModel.payloadForViz, data),
    };
  }, [conf, data]);

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);
  return (
    <DefaultVizBox width={width} height={height}>
      <ReadonlyRichText
        ref={topStatsRef}
        value={statsContent.top}
        styles={{
          root: {
            border: 'none',
            maxWidth: width,
            '&.mantine-RichTextEditor-root': {
              overflow: 'auto !important',
            },
          },
          content: {
            '&.mantine-RichTextEditor-content .ProseMirror': {
              padding: 0,
            },
            '&.mantine-RichTextEditor-content .ProseMirror > p': {
              fontSize: '12px',
              lineHeight: 1.55,
            },
          },
        }}
        dashboardState={contentModel.dashboardState}
        variableAggValueMap={panel.variableAggValueMap}
      />

      <Chart
        variables={variables}
        width={finalWidth}
        height={finalHeight}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />

      <ReadonlyRichText
        ref={bottomStatsRef}
        value={statsContent.bottom}
        styles={{
          root: {
            border: 'none',
            maxWidth: width,
            '&.mantine-RichTextEditor-root': {
              overflow: 'auto !important',
            },
          },
          content: {
            '&.mantine-RichTextEditor-content .ProseMirror': {
              padding: 0,
            },
            '&.mantine-RichTextEditor-content .ProseMirror > p': {
              fontSize: '12px',
              lineHeight: 1.55,
            },
          },
        }}
        dashboardState={contentModel.dashboardState}
        variableAggValueMap={panel.variableAggValueMap}
      />
    </DefaultVizBox>
  );
});
