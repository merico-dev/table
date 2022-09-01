import { randomId } from '@mantine/hooks';
import { ITemplateVariable } from '../types';

export function getANewVariable() {
  return {
    name: randomId(),
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
  } as ITemplateVariable;
}
