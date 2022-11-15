import { EMetricSet, IExpertSystemConf } from '../../../type';
import { dev_load_heatmap, TDataForHeatmap } from './heatmap';
import { dev_load_pareto, TDataForPareto } from './pareto';
import { dev_load_productivity, TDataForProductivity } from './productivity';

export type TDevLoadData = $TSFixMe | TDataForProductivity[] | TDataForHeatmap[] | TDataForPareto[];

function getContent(conf: IExpertSystemConf, data: TDevLoadData) {
  switch (conf.metric_set) {
    case EMetricSet.productivity:
      return dev_load_productivity(data as TDataForProductivity[]);
    case EMetricSet.heatmap:
      return dev_load_heatmap(data as TDataForHeatmap[]);
    case EMetricSet.pareto:
      return dev_load_pareto(data as TDataForPareto[]);
    default:
      throw new Error('Invalid metric_set for scenario[dev_load]');
  }
}

export function buildPayloadForDevLoad(conf: IExpertSystemConf, data: TDevLoadData) {
  return {
    dev_load: {
      ...getContent(conf, data),
    },
  };
}
