export interface IVizMericoLinearGaugeConf {
  hello: string;
}

export const getDefaultConfig = () => {
  const config: IVizMericoLinearGaugeConf = {
    hello: 'world',
  };
  return config;
};
