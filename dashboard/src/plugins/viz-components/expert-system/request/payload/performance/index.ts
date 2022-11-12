import { EMetricSet, IExpertSystemConf } from '../../../type';
import { performance_quality, TDataForQuality } from './quality';
import { performance_quality_history, TDataForQualityHistory } from './quality_history';

export type TPerformanceData = $TSFixMe | TDataForQuality[];

function getContent(conf: IExpertSystemConf, data: TPerformanceData) {
  switch (conf.metric_set) {
    case EMetricSet.quality:
      return performance_quality(data as TDataForQuality[]);
    case EMetricSet.quality_history:
      return performance_quality_history(data as TDataForQualityHistory[]);
    case EMetricSet.skills:
    case EMetricSet.pareto:
    default:
      throw new Error('Invalid metric_set for scenario[performance]');
  }
}

export function buildPayloadForPerformance(conf: IExpertSystemConf, data: TPerformanceData) {
  return {
    performance: {
      ...getContent(conf, data),
    },
  };
}
