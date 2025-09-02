export type MericoLinearGaugeSection = {
  name: string;
  color: string;
  minKey: string; // zero | dataKey
};

export interface IVizMericoLinearGaugeConf {
  sections: MericoLinearGaugeSection[];
}

export const getDefaultConfig = () => {
  const config: IVizMericoLinearGaugeConf = {
    sections: [
      {
        name: '较差',
        color: '#b30024',
        minKey: '',
      },
      {
        name: '一般',
        color: '#e69500',
        minKey: '',
      },
      {
        name: '良好',
        color: '#74add1',
        minKey: '',
      },
      {
        name: '优秀',
        color: '#238e68',
        minKey: '',
      },
    ],
  };
  return config;
};
