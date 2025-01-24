import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaults } from 'lodash';
import React, { useMemo } from 'react';

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

  const option = useMemo(() => getOption(conf, data, variables), [conf, data, variables]);

  if (!width || !height) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        ref={echartsInstanceRef}
        onEvents={onEvents}
        style={getBoxContentStyle(width, height)}
        notMerge
        theme="merico-light"
      />
    </DefaultVizBox>
  );
}
