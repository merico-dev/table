import { EChartsInstance } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { defaultsDeep } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { DefaultVizBox, getBoxContentStyle } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { parseDataKey } from '~/utils';
import { notifyVizRendered } from '../viz-instance-api';
import { getOption } from './option';
import { Toolbox } from './toolbox';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChart({ context, instance }: VizViewProps) {
  const { value: conf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;

  // convert strings as numbers
  const queryData = useMemo(() => {
    const rawData = context.data;
    const xDataKey = conf?.x_axis.data_key;
    const yDataKey = conf?.regression?.y_axis_data_key;

    if (!xDataKey || !yDataKey) {
      return [];
    }
    const x = parseDataKey(xDataKey);
    const y = parseDataKey(yDataKey);
    return rawData[x.queryID].map((row) => {
      if (typeof row[y.columnKey] === 'number') {
        return row;
      }
      return {
        ...row,
        [y.columnKey]: Number(row[y.columnKey]),
      };
    });
  }, [context.data, conf?.regression.y_axis_data_key]);

  const option = useMemo(() => {
    return getOption(defaultsDeep({}, conf, DEFAULT_CONFIG), queryData);
  }, [conf, queryData]);

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

  if (!width || !height || !conf) {
    return null;
  }
  return (
    <DefaultVizBox width={width} height={height}>
      <Toolbox conf={conf} queryData={queryData} />
      <ReactEChartsCore
        echarts={echarts}
        onChartReady={onChartReady}
        option={option}
        onEvents={onEvents}
        style={getBoxContentStyle(width, height)}
        notMerge
        theme="merico-light"
      />
    </DefaultVizBox>
  );
}
