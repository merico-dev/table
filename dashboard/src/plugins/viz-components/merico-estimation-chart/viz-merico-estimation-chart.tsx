import { Box, Button, HoverCard, Table } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useStorageData } from '~/plugins/hooks';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

echarts.use([
  BarChart,
  LineChart,
  HeatmapChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
  VisualMapComponent,
]);

function Toolbox() {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Button size="xs" variant="subtle" compact leftIcon={<IconInfoCircle size={14} />}>
          指标说明
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table fontSize={14}>
          <tbody>
            <tr>
              <th>档位偏差</th>
              <td>
                按照斐波那契数列设定一系列档位，按照档位分组估算数据和实际数据。用实际数据档位减估算数据档位，即档位偏差。
              </td>
            </tr>
          </tbody>
        </Table>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

function Chart({
  conf,
  data,
  width,
  height,
}: {
  conf: IMericoEstimationChartConf;
  data: TVizData;
  width: number;
  height: number;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  if (!width || !height) {
    return null;
  }
  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}

export function VizMericoEstimationChart({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data as TVizData;
  const { width, height } = context.viewport;
  const { x_axis, deviation } = conf;
  const { estimated_value, actual_value } = deviation.data_keys;
  if (!x_axis.data_key || !estimated_value || !actual_value) {
    return null;
  }
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Toolbox conf={conf} />
      <Chart width={width} height={height - 40} data={data} conf={conf} />
    </Box>
  );
}
