import { TMericoStatsConf, TMericoStatsMetric } from '../type';

export function v2(legacyConf: any): TMericoStatsConf {
  const { metrics, ...rest } = legacyConf;
  return {
    ...rest,
    metrics: metrics.map((m: TMericoStatsMetric) => ({
      ...m,
      postfix: m.postfix ?? {
        type: 'text',
        value: '',
      },
    })),
  };
}
