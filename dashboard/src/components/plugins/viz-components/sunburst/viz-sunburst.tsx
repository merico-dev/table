import { useLatest } from 'ahooks';
import type { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';

import { useStorageData } from '~/components/plugins/hooks';
import { DefaultVizBox, getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { notifyVizRendered } from '../viz-instance-api';
import { getOption } from './option';
import { DEFAULT_CONFIG, ISunburstConf } from './type';

export function VizSunburst({ context, instance }: VizViewProps) {
  const { variables } = context;
  const { value: confValue } = useStorageData<ISunburstConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);

  const data = context.data;
  const { width, height } = context.viewport;

  const handleChartRenderFinished = useCallback(
    (chartOptions: unknown) => {
      notifyVizRendered(instance, chartOptions);
    },
    [instance],
  );

  const option = useMemo(() => getOption(conf, data, variables), [conf, data, variables]);

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

  if (!width || !height) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        onChartReady={handleChartReady}
        style={getBoxContentStyle(width, height)}
        notMerge
        theme="merico-light"
      />
    </DefaultVizBox>
  );
}
