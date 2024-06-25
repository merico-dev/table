import { getDefaultVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';
import { TMericoHeatmapConf } from '../type';

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
