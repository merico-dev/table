import { randomId } from '@mantine/hooks';
import { defaultNumberFormat } from '../../../components/panel/settings/common/numbro-format-selector';
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
    formatter: defaultNumberFormat,
  } as ITemplateVariable;
}
