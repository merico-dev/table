import { useLatest } from 'ahooks';
import type { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
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

  const handleChartRenderFinished = useCallback(
    (chartOptions: unknown) => {
      notifyVizRendered(instance, chartOptions);
    },
    [instance],
  );

  const echartsRef = React.useRef<EChartsInstance>();
  const onRenderFinishedRef = useLatest(handleChartRenderFinished);

  useEffect(() => {
    setTimeout(() => {
      onRenderFinishedRef.current?.(echartsRef.current?.getOption());
    }, 100);
  }, [option]);

  const handleChartReady = (echartsInstance: EChartsInstance) => {
    echartsRef.current = echartsInstance;
  };

  return (
    <ReactEChartsCore
      onChartReady={handleChartReady}
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
