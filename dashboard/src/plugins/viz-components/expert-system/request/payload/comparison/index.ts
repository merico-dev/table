import { EMetricSet, IExpertSystemConf } from '../../../type';
import { comparison_efficiency, TDataForComparisonEfficiency } from './efficiency';

export type TComparisonData = $TSFixMe | TDataForComparisonEfficiency[];

function getContent(conf: IExpertSystemConf, data: TComparisonData) {
  switch (conf.metric_set) {
    case EMetricSet.efficiency:
      return comparison_efficiency(data as TDataForComparisonEfficiency[]);
    default:
      throw new Error('Invalid metric_set for scenario[comparison]');
  }
}

export function buildPayloadForComparison(conf: IExpertSystemConf, data: TComparisonData) {
  return {
    comparison: {
      ...getContent(conf, data),
    },
  };
}
