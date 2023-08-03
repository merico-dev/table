import { AnyObject } from '~/types';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils/template';

export function getVariableValueMap(data: TPanelData, variables: ITemplateVariable[]) {
  const ret: Record<string, string | number> = {};

  variables.map((variable) => {
    const value = getAggregatedValue(variable, data);
    ret[variable.name] = formatAggregatedValue(variable, value);
  });

  return ret;
}
