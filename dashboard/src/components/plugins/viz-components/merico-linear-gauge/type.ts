import { defaultNumberFormat, getDefaultNumberFormat, TNumberFormat } from '~/utils';

export type MericoLinearGaugeSection = {
  name: string;
  color: string;
  minKey: string; // zero | dataKey
};

export interface IMericoLinearGaugeConf {
  value: string;
  format: TNumberFormat;
  order: 'asc' | 'desc';
  sections: MericoLinearGaugeSection[];
  stats: {
    top: string;
    bottom: string;
  };
}

export const getDefaultConfig = () => {
  const config: IMericoLinearGaugeConf = {
    value: '',
    order: 'asc',
    format: getDefaultNumberFormat(),
    sections: [
      {
        name: '较差',
        color: '#ff0034',
        minKey: '',
      },
      {
        name: '一般',
        color: '#ffc04d',
        minKey: '',
      },
      {
        name: '良好',
        color: '#adcfe4',
        minKey: '',
      },
      {
        name: '优秀',
        color: '#32cb95',
        minKey: '',
      },
    ],
    stats: {
      top: '',
      bottom: '',
    },
  };
  return config;
};
