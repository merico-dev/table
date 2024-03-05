import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaultsDeep, isEmpty } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, parseDataKey } from '~/utils';
import { getOption } from './option';
import { ClickRadarChartSeries } from './triggers/click-radar-chart';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

interface IClickRadarSeries {
  type: 'click';
  seriesType: 'radar';
  componentSubType: 'radar';
  componentType: 'series';
  name: string;
  color: string;
  value: AnyObject;
}

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IRadarChartConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useMemo(() => {
    const { queryID, columnKey } = parseDataKey(conf.series_name_key);
    const main = _.keyBy(data[queryID], columnKey);
    const additionals = conf.additional_series.reduce((acc, s) => {
      const seriesKey = parseDataKey(s.name_key);
      const m = _.keyBy(data[seriesKey.queryID], seriesKey.columnKey);
      return { ...acc, ...m };
    }, main);
    return { ...main, ...additionals };
  }, [data, conf.series_name_key, conf.additional_series]);

  const triggers = useTriggerSnapshotList<IRadarChartConf>(interactionManager.triggerManager, ClickRadarChartSeries.id);

  const handleRadarSeriesClick = useCallback(
    (params: IClickRadarSeries) => {
      const rowData = _.get(rowDataMap, params.name, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleRadarSeriesClick,
    };
  }, [handleRadarSeriesClick]);

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), data);
  }, [conf, data]);

  if (!width || !height) {
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

export function VizRadarChart({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  if (!width || !height || !conf || isEmpty(conf?.dimensions)) {
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
