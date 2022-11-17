import { EMetricSet, IExpertSystemConf } from '../../../type';
import { performance_efficiency, TDataForEfficiency } from './efficiency';
import { performance_pareto, TDataForPareto } from './pareto';
import { performance_quality, TDataForQuality } from './quality';
import { performance_quality_history, TDataForQualityHistory } from './quality_history';

export type TPerformanceData = $TSFixMe | TDataForQuality[];

function getContent(conf: IExpertSystemConf, data: TPerformanceData) {
  switch (conf.metric_set) {
    case EMetricSet.quality:
      return performance_quality(data as TDataForQuality[]);
    case EMetricSet.quality_history:
      return performance_quality_history(data as TDataForQualityHistory[]);
    case EMetricSet.efficiency:
      return performance_efficiency(data as TDataForEfficiency[]);
    case EMetricSet.pareto:
      return performance_pareto(data as TDataForPareto[]);
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
