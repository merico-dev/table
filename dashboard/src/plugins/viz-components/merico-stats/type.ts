import { TNumbroFormat, defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';

export type TMericoStatsMetric = {
  id: string;
  names: {
    value: string;
    basis: string;
  };
  data_keys: {
    value: TDataKey;
    basis: TDataKey;
  };
  formatter: TNumbroFormat;
};

export type TMericoStatsConf = {
  metrics: TMericoStatsMetric[];
};

export const DEFAULT_CONFIG: TMericoStatsConf = {
  metrics: [],
};

export function getNewMetric(): TMericoStatsMetric {
  return {
    id: new Date().getTime().toString(),
    names: {
      value: 'Value',
      basis: 'Basis',
    },
    data_keys: {
      value: '',
      basis: '',
    },
    formatter: defaultNumbroFormat,
  };
}
