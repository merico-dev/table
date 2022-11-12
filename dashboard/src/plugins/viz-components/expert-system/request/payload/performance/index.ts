import { EMetricSet, IExpertSystemConf } from '../../../type';
import { performance_quality } from './quality';

function getContent(conf: IExpertSystemConf, data: any) {
  switch (conf.metric_set) {
    case EMetricSet.quality:
      return performance_quality(data);
    case EMetricSet.quality_history:
    case EMetricSet.skills:
    case EMetricSet.pareto:
    default:
      throw new Error('Invalid metric_set for scenario[performance]');
  }
}

export function buildPayloadForPerformance(conf: IExpertSystemConf, data: any) {
  return {
    performance: {
      ...getContent(conf, data),
    },
  };
}
