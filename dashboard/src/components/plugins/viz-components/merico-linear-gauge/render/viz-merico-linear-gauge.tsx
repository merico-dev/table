import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '~/components/plugins';
import { getDefaultConfig, IMericoLinearGaugeConf } from '../type';
import { useMemo, useState } from 'react';
import { defaults } from 'lodash';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { StatsAroundViz } from '~/components/plugins/common-echarts-fields/stats-around-viz';
import { Chart } from './chart';

export function VizMericoLinearGauge({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoLinearGaugeConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, getDefaultConfig()), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;
  const [topStatsHeight, setTopStatsHeight] = useState(0);
  const [bottomStatsHeight, setBottomStatsHeight] = useState(0);

  const finalHeight = Math.max(0, getBoxContentHeight(height) - topStatsHeight - bottomStatsHeight);
  const finalWidth = getBoxContentWidth(width);

  return (
    <DefaultVizBox width={width} height={height}>
      <StatsAroundViz onHeightChange={setTopStatsHeight} value={conf.stats.top} context={context} />
      <Chart width={finalWidth} height={finalHeight} data={data} conf={conf} />
    </DefaultVizBox>
  );
}
