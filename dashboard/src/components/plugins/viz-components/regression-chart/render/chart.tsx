import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';

import { EChartsInstance } from 'echarts-for-react';
import { defaultsDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { notifyVizRendered } from '../../viz-instance-api';
import { getDefaultConfig, IRegressionChartConf } from '../type';
import { getOption } from './option';
import { Toolbox } from './toolbox';
import { useDataKey } from './use-data-key';
import { parseDataKey } from '~/utils';

type Props = Pick<VizViewProps, 'context' | 'instance'> & {
  conf: IRegressionChartConf;
  width: number;
  height: number;
};

export const RenderRegressionChart = ({ context, instance, conf, width, height }: Props) => {
  const xDataKey = useDataKey(conf.x_axis.data_key);
  const yDataKey = useDataKey(conf.regression.y_axis_data_key);
  const groupKey = useDataKey(conf.regression.group_by_key);
  const x = parseDataKey(xDataKey.value);
  const y = parseDataKey(yDataKey.value);
  const g = parseDataKey(groupKey.value);

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, getDefaultConfig()), context.data, x, y, g);
  }, [conf, context.data, x, y, g]);

  const echartsRef = useRef<EChartsInstance | null>(null);
  const onChartReady = (echartsInstance: EChartsInstance) => {
    echartsRef.current = echartsInstance;
  };

  const handleFinished = useCallback(() => {
    const chart = echartsRef.current;
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
    <>
      <Toolbox
        conf={conf}
        context={context}
        xDataKey={xDataKey}
        yDataKey={yDataKey}
        groupKey={groupKey}
        x={x}
        y={y}
        g={g}
      />
      <ReactEChartsCore
        echarts={echarts}
        onChartReady={onChartReady}
        option={option}
        onEvents={onEvents}
        style={getBoxContentStyle(width, height)}
        notMerge
        theme="merico-light"
      />
    </>
  );
};
