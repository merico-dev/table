import ReactEChartsCore from 'echarts-for-react/lib/core';
import 'echarts-gl';
import * as echarts from 'echarts/core';
import _, { defaults } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useRowDataMap } from '~/components/plugins/hooks/use-row-data-map';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { ClickBoxplotSeries } from './triggers';
import { DEFAULT_CONFIG, IBoxplotChartConf, IBoxplotDataItem } from './type';
import { useTranslation } from 'react-i18next';
import { notifyVizRendered } from '~/components/plugins/viz-components/viz-instance-api';

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
  const { t } = useTranslation();
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

  const echartsInstanceRef = useRef<ReactEChartsCore>(null);
  const handleFinished = useCallback(() => {
    const chart = echartsInstanceRef.current?.getEchartsInstance();
    if (!chart) return;
    notifyVizRendered(instance, chart.getOption());
  }, []);

  const onEvents = useMemo(() => {
    return {
      click: handleSeriesClick,
      finished: handleFinished,
    };
  }, [handleSeriesClick, handleFinished]);

  const option = useMemo(() => getOption({ config, data, variables, t }), [config, data, variables, t]);

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
