import { Box } from '@mantine/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { getBoxContentHeight, getBoxContentWidth, paddings } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { Toolbox } from './toolbox';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

function Chart({
  conf,
  data,
  width,
  height,
  metricKey,
}: {
  conf: IMericoEstimationChartConf;
  data: TPanelData;
  width: number;
  height: number;
  metricKey: string;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, metricKey, data);
  }, [conf, data, metricKey]);

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}

export function VizMericoEstimationChart({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
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
  if (!width || !height) {
    return null;
  }
  const finalWidth = Math.max(getBoxContentWidth(width), 300);
  const finalHeight = Math.max(getBoxContentHeight(height), 370);
  return (
    <Box
      pt={paddings.top}
      pr={paddings.right}
      pb={paddings.bottom}
      pl={paddings.left}
      sx={{ overflow: 'hidden', height, width }}
    >
      <Toolbox conf={conf} metricKey={metricKey} setMetricKey={setMetricKey} />
      <Chart width={finalWidth} height={finalHeight - 30} data={data} conf={conf} metricKey={metricKey} />
    </Box>
  );
}
