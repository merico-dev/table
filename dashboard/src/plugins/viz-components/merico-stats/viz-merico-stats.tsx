import { Box } from '@mantine/core';
import { RadarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import _ from 'lodash';
import { useMemo } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { VizViewProps } from '~/types/plugin';
import { ITemplateVariable } from '~/utils/template';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';

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
  variables,
}: {
  conf: TMericoStatsConf;
  data: TPanelData;
  width: number;
  height: number;
  variables: ITemplateVariable[];
}) {
  return <Box>TODO</Box>;
}

export function VizMericoStats({ context, instance }: VizViewProps) {
  const { value: confValue } = useStorageData<TMericoStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => _.defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <Box>
      <Chart variables={variables} width={width} height={height} data={data} conf={conf} />
    </Box>
  );
}
