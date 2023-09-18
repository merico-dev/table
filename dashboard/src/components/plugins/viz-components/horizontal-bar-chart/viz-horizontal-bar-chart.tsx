import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
import { ClickEchartSeries } from '../cartesian/triggers';
import { getOption } from './option';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';

interface IClickEchartsSeries {
  type: 'click';
  seriesType: 'line' | 'scatter' | 'bar';
  componentSubType: 'line' | 'scatter' | 'bar';
  componentType: 'series';
  name: string;
  color: string;
  value: string; // string-typed number
}

echarts.use([
  DataZoomComponent,
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  MarkLineComponent,
  MarkAreaComponent,
]);

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IHorizontalBarChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
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
