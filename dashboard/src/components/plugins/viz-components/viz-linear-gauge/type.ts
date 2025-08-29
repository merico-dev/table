export interface IVizLinearGaugeConf {
  hello: string;
}

export const getDefaultConfig = () => {
  const config: IVizLinearGaugeConf = {
    hello: 'world',
  };
  return config;
};
