import { TNumberFormat, defaultNumberFormat } from '~/utils';
import { AlignItems, JustifyContent } from '../../editor-components';

export type TMetricPostfix = {
  type: 'filter-option-label' | 'text';
  value: string;
};

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
  formatter: TNumberFormat;
  postfix: TMetricPostfix;
};

export type TMericoStatsStyle = {
  justify: JustifyContent;
  align: AlignItems;
};

export type TMericoStatsConf = {
  styles: TMericoStatsStyle;
  metrics: TMericoStatsMetric[];
};

export const DEFAULT_CONFIG: TMericoStatsConf = {
  styles: {
    justify: 'space-around',
    align: 'start',
  },
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
    formatter: defaultNumberFormat,
    postfix: {
      type: 'text',
      value: '',
    },
  };
}
