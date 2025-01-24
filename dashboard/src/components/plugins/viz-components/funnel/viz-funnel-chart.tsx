import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { VizInstance, VizViewProps } from '~/types/plugin';
import { getOption } from './option';
import { DEFAULT_CONFIG, IFunnelConf } from './type';
import { notifyVizRendered } from '~/components/plugins/viz-components/viz-instance-api';

function Chart({
  conf,
  data,
  width,
  height,
  instance,
}: {
  conf: IFunnelConf;
  data: TPanelData;
  width: number;
  height: number;
  instance: VizInstance;
}) {
  const option = React.useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  const echartsInstanceRef = React.useRef<ReactEChartsCore>(null);
  const handleFinished = React.useCallback(() => {
    const chart = echartsInstanceRef.current?.getEchartsInstance();
    if (!chart) return;
    notifyVizRendered(instance, chart.getOption());
  }, [instance]);
  const onEvents = useMemo(
    () => ({
      finished: handleFinished,
    }),
    [handleFinished],
  );

  return (
    <ReactEChartsCore
      ref={echartsInstanceRef}
      onEvents={onEvents}
      echarts={echarts}
      option={option}
      style={{ width, height }}
      notMerge
      theme="merico-light"
    />
  );
}

export function VizFunnelChart({ context, instance }: VizViewProps) {
  const { value: confValue } = useStorageData<IFunnelConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;

  if (!width || !height) {
    return null;
  }

  return (
    <DefaultVizBox width={width} height={height}>
      <Chart
        instance={instance}
        width={getBoxContentWidth(width)}
        height={getBoxContentHeight(height)}
        data={data}
        conf={conf}
      />
    </DefaultVizBox>
  );
}
