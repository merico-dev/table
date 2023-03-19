import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaultsDeep, isEmpty } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
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

echarts.use([RadarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IRadarChartConf;
  data: TVizData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useMemo(() => {
    return _.keyBy(data, conf.series_name_key);
  }, [data, conf.series_name_key]);

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
  const data = context.data as $TSFixMe[];
  const { width, height } = context.viewport;

  if (!width || !height || !conf || isEmpty(conf?.dimensions)) {
    return null;
  }
  return (
    <Box>
      <Chart
        variables={variables}
        width={width}
        height={height}
        data={data}
        conf={conf}
        interactionManager={interactionManager}
      />
    </Box>
  );
}
