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
    sections: [],
  };
  return config;
};
