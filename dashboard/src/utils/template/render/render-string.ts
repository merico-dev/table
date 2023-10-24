import { aggregateValue } from '../../aggregation';
import { ITemplateVariable } from '../types';
import { formatAggregatedValue } from '../utils';

export function variableToString(variable: ITemplateVariable, data: TPanelData) {
  const { data_field, aggregation } = variable;
  const value = aggregateValue(data, data_field, aggregation);
  return formatAggregatedValue(variable, value);
}

export function variablesToStrings(variables: ITemplateVariable[], data: TPanelData) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach((variable) => {
    ret[variable.name] = variableToString(variable, data);
  });
  return ret;
}

export function templateToString(template: string, variables: ITemplateVariable[], data: TPanelData) {
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
