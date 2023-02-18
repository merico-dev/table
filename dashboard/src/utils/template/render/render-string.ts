import { aggregateValue } from '../../aggregation';
import { ITemplateVariable } from '../types';
import { formatAggregatedValue } from '../utils';

function variablesToStrings(variables: ITemplateVariable[], data: Record<string, number>[]) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach((variable) => {
    const { name, data_field, aggregation } = variable;
    const value = aggregateValue(data, data_field, aggregation);
    ret[name] = formatAggregatedValue(variable, value);
  });
  return ret;
}

export function templateToString(template: string, variables: ITemplateVariable[], data: Record<string, number>[]) {
  const variableStrings = variablesToStrings(variables, data);
  const regx = /^\{(.+)\}(.*)$/;
  return template
    .split('$')
    .map((text) => {
      const match = regx.exec(text);
      if (!match) {
        return text;
      }
      const element = variableStrings[match[1]];
      if (!element) {
        return text;
      }
      const rest = match[2] ?? '';
      return `${element}${rest}`;
    })
    .join('');
}
