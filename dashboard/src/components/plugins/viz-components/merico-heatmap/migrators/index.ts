import { getDefaultVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';
import { TMericoHeatmapConf } from '../type';
import { IEchartsTooltipMetric } from '~/components/plugins/common-echarts-fields/tooltip-metric';
import { getDefaultSeriesUnit } from '~/components/plugins/common-echarts-fields/series-unit';

export function v2(legacyConf: any): TMericoHeatmapConf {
  const {
    visualMap = getDefaultVisualMap(),
    heat_block: { min, max, ...restHeatBlock },
    ...rest
  } = legacyConf;
  return {
    ...rest,
    heat_block: restHeatBlock,
    visualMap: {
      ...getDefaultVisualMap(),
      min,
      max,
    },
  };
}
export function v3(legacyConf: any): TMericoHeatmapConf {
  const metrics = legacyConf.tooltip.metrics as IEchartsTooltipMetric[];
  return {
    ...legacyConf,
    tooltip: {
      ...legacyConf.tooltip,
      metrics: metrics.map((m) => ({
        ...m,
        unit: m.unit ?? getDefaultSeriesUnit(),
      })),
    },
  };
}

export function v4(legacyConf: any): TMericoHeatmapConf {
  const { heat_block } = legacyConf;
  return {
    ...legacyConf,
    heat_block: {
      ...heat_block,
      unit: heat_block.unit ?? getDefaultSeriesUnit(),
    },
  };
}
