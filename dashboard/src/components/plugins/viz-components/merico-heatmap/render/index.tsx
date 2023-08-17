import { Box, ScrollArea } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { HeatmapChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _, { defaults } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { useStorageData } from '~/components/plugins/hooks';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizViewProps } from '~/types/plugin';
import { parseDataKey } from '~/utils/data';
import { ITemplateVariable } from '~/utils/template';
import { getOption } from './option';
import { ClickHeatBlock } from '../triggers';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from '../type';

const MERICO_HEATMAP_UNIT_SIZE = 25;
interface IClickHeatBlock {
  type: 'click';
  seriesType: 'heatblock';
  componentSubType: 'heatblock';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, string, string];
  rowData: AnyObject;
}

echarts.use([
  DataZoomComponent,
  HeatmapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

function Chart({
  conf,
  data,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: TMericoHeatmapConf;
  data: TPanelData;
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
}) {
  const rowDataMap = useMemo(() => {
    const x = parseDataKey(conf.x_axis.data_key);
    const y = parseDataKey(conf.y_axis.data_key);
    return _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);
  }, [data, conf.x_axis.data_key, conf.y_axis.data_key]);

  const triggers = useTriggerSnapshotList<TMericoHeatmapConf>(interactionManager.triggerManager, ClickHeatBlock.id);

  const handleHeatBlockClick = useCallback(
    (params: IClickHeatBlock) => {
      const [x, y] = params.value;
      const rowData = _.get(rowDataMap, `${x}---${y}`, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );

  const onEvents = useMemo(() => {
    return {
      click: handleHeatBlockClick,
    };
  }, [handleHeatBlockClick]);

  const option = React.useMemo(() => {
    return getOption(conf, data, variables);
  }, [conf, data]);

  const size = useMemo(() => {
    const ret = {
      w: width,
      h: height,
    };
    try {
      const xCount = option.xAxis?.data.length ?? 0;
      const yCount = option.yAxis?.data.length ?? 0;
      ret.w = Math.max(ret.w, xCount * MERICO_HEATMAP_UNIT_SIZE);
      ret.h = Math.max(ret.h, yCount * MERICO_HEATMAP_UNIT_SIZE);
    } catch (error) {
      console.error(error);
    }
    return ret;
  }, [width, height, option]);

  if (!width || !height) {
    return null;
  }
  console.log({ size, width, height });
  return (
    <ScrollArea w={width} h={height} type="auto" pr={size.w > width ? '13px' : 0} pb={size.h > height ? '15px' : 0}>
      <Box w={size.w} h={size.h} pb={size.h > height ? '15px' : 0}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ width: '100%', height: '100%' }}
          onEvents={onEvents}
          notMerge
          theme="merico-light"
        />
      </Box>
    </ScrollArea>
  );
}

export function RenderMericoHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<TMericoHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  return (
    <Chart
      variables={variables}
      width={width}
      height={height}
      data={data}
      conf={conf}
      interactionManager={interactionManager}
    />
  );
}
