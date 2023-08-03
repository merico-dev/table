import { randomId } from '@mantine/hooks';
import { defaultNumbroFormat } from '../../../components/panel/settings/common/numbro-format-selector';
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
    aggregation: { type: 'none', config: {} },
    formatter: defaultNumbroFormat,
  } as ITemplateVariable;
}
