import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IFunnelConf } from './type';

function Chart({ conf, data, width, height }: { conf: IFunnelConf; data: TPanelData; width: number; height: number }) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  return <ReactEChartsCore echarts={echarts} option={option} style={{ width, height }} notMerge theme="merico-light" />;
}

export function VizFunnelChart({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IFunnelConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  if (!width || !height) {
    return null;
  }

  return (
    <DefaultVizBox width={width} height={height}>
      <Chart width={getBoxContentWidth(width)} height={getBoxContentHeight(height)} data={data} conf={conf} />
    </DefaultVizBox>
  );
}
