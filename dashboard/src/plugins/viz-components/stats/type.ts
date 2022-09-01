import { ITemplateVariable } from '../../../utils/template';

export const DEFAULT_CONFIG: IVizStatsConf = {
  align: 'center',
  template: 'The variable ${value} is defined in Variables section',
  variables: [
    {
      name: 'value',
      size: '20px',
      weight: 'bold',
      color: {
        type: 'static',
        staticColor: 'blue',
      },
      data_field: '',
      aggregation: 'none',
      formatter: {
        output: 'number',
        mantissa: 0,
      },
    },
  ],
};

export interface IVizStatsConf {
  align: 'center';
  template: string;
  variables: ITemplateVariable[];
}
