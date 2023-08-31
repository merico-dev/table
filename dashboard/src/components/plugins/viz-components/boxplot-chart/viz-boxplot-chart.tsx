import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import 'echarts-gl';
import { BoxplotChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { ClickBoxplotSeries } from './triggers';
import { DEFAULT_CONFIG, IBoxplotChartConf, IBoxplotDataItem } from './type';

echarts.use([
  DataZoomComponent,
  BoxplotChart,
  MarkLineComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface IClickBoxplotSeries {
  type: 'click';
  seriesType: 'boxplot';
  componentSubType: 'boxplot';
  componentType: 'series';
  name: string;
  color: string;
  value: IBoxplotDataItem;
}

export function VizBoxplotChart({ context, instance }: VizViewProps) {
  const { value: conf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data;
  const { width, height } = context.viewport;
  const config = defaults({}, conf, DEFAULT_CONFIG);

  // interactions
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IBoxplotChartConf>(interactionManager.triggerManager, ClickBoxplotSeries.id);

  const rowDataMap = useRowDataMap(data, config.x_axis.data_key);

  const handleSeriesClick = useCallback(
    (params: IClickBoxplotSeries) => {
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

  const option = useMemo(() => getOption({ config, data, variables }), [config, data, variables]);

  if (!conf || !width || !height) {
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
