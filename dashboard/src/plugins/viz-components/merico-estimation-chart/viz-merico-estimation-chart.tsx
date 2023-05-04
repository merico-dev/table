import { Box, Button, Group, HoverCard, Select, Text, Table, NativeSelect } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart, HeatmapChart, LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defaults } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
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

const SelectorStyles = {
  input: {
    border: 'none !important',
    paddingLeft: 0,
    lineHeight: '1.55 !important',
  },
};

function Toolbox({
  conf,
  metricKey,
  setMetricKey,
}: {
  conf: IMericoEstimationChartConf;
  metricKey: string;
  setMetricKey: (v: string) => void;
}) {
  const { deviation, metrics } = conf;
  const options = useMemo(() => {
    const ret = metrics.map((m) => ({
      label: m.name,
      value: m.data_key,
    }));
    ret.push({
      label: deviation.name ? deviation.name : deviation.data_keys.actual_value,
      value: deviation.data_keys.actual_value,
    });
    return ret;
  }, [deviation, metrics]);

  return (
    <Group position="apart">
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
      <Group spacing={1}>
        <Text size={12} color="dimmed" sx={{ cursor: 'default', userSelect: 'none' }}>
          基线指标
        </Text>
        <NativeSelect
          size="xs"
          data={options}
          value={metricKey}
          onChange={(e) => setMetricKey(e.currentTarget.value)}
          styles={SelectorStyles}
        />
      </Group>
    </Group>
  );
}

function Chart({
  conf,
  data,
  width,
  height,
  metricKey,
}: {
  conf: IMericoEstimationChartConf;
  data: TVizData;
  width: number;
  height: number;
  metricKey: string;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, metricKey, data);
  }, [conf, data, metricKey]);

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
  const [metricKey, setMetricKey] = useState(actual_value);
  useEffect(() => {
    setMetricKey((m) => (m ? m : actual_value));
  }, [actual_value]);

  if (!x_axis.data_key || !estimated_value || !actual_value) {
    return null;
  }
  const finalWidth = Math.max(width, 300);
  const finalHeight = Math.max(height, 370);
  return (
    <Box sx={{ overflow: 'hidden', height: finalHeight, width: finalWidth }}>
      <Toolbox conf={conf} metricKey={metricKey} setMetricKey={setMetricKey} />
      <Chart width={finalWidth} height={finalHeight - 30} data={data} conf={conf} metricKey={metricKey} />
    </Box>
  );
}
