import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { getOption } from './option';
import { ClickParetoSeries } from './triggers';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

echarts.use([BarChart, LineChart, DataZoomComponent, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

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
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;
  const conf = defaults({}, confValue, DEFAULT_CONFIG);
  const option = getOption(conf, data, variables);

  // interactions
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IParetoChartConf>(interactionManager.triggerManager, ClickParetoSeries.id);

  const rowDataMap = useMemo(() => {
    return _.keyBy(data, conf.x_axis.data_key);
  }, [data, conf.x_axis.data_key]);

  const handleSeriesClick = useCallback(
    (params: IClickParetoSeries) => {
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

  if (!conf || !width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} onEvents={onEvents} notMerge />;
}
