/**
 * NOTE: refactor is coming
 * https://github.com/merico-dev/table/issues/178
 */
import { Text } from '@mantine/core';
import numbro from 'numbro';
import { aggregateValue } from '../aggregation';
import { InterpolateColor } from '../color-mapping';
import { ColorConfType, ITemplateVariable } from './types';

function getColorByColorConf(conf: ColorConfType, value: number) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    return new InterpolateColor(conf).getColor(value);
  }
  return 'black';
}

function getNonStatsDataText(data: any) {
  if (data === null) {
    return 'null';
  }
  if (data === undefined) {
    return 'undefined';
  }
  if (Array.isArray(data)) {
    return `Array(${data.length})`;
  }
  return data.toString();
}

export function getAggregatedValue({ data_field, aggregation }: ITemplateVariable, data: Record<string, number>[]) {
  return aggregateValue(data, data_field, aggregation);
}

export function formatAggregatedValue({ formatter }: ITemplateVariable, value: number | string) {
  if (!['string', 'number'].includes(typeof value)) {
    return getNonStatsDataText(value);
  }
  return numbro(value).format(formatter);
}

function variablesToStrings(variables: ITemplateVariable[], data: Record<string, number>[]) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach((variable) => {
    const { name, data_field, aggregation } = variable;
    const value: number = aggregateValue(data, data_field, aggregation);
    ret[name] = formatAggregatedValue(variable, value);
  });
  return ret;
}

function variablesToElements(variables: ITemplateVariable[], data: Record<string, number>[]) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach((variable) => {
    const { name, color, data_field, aggregation, size, weight } = variable;
    const value: number = aggregateValue(data, data_field, aggregation);
    const valueContent = formatAggregatedValue(variable, value);
    ret[name] = (
      <Text sx={{ fontSize: size, display: 'inline' }} color={getColorByColorConf(color, value)} weight={weight}>
        {valueContent}
      </Text>
    );
  });
  return ret;
}

function preserveWhiteSpaces(text: string) {
  return text.split(' ').map((s) => <>{s}&nbsp;</>);
}

function withLineBreaks(text: string) {
  const normalized = text.replaceAll('<br />', '<br/>').replaceAll('\n', '<br/>');
  const splitted = normalized.split('<br/>');
  const ret = splitted
    .map((t, i) => {
      const arr: Array<React.ReactNode> = [preserveWhiteSpaces(t)];
      if (i !== splitted.length - 1) {
        arr.push(<br />);
      }
      return arr;
    })
    .flat()
    .filter((t) => t !== undefined);
  return ret;
}

function textToJSX(text: string) {
  return withLineBreaks(text);
}

export function templateToJSX(template: string, variables: ITemplateVariable[], data: Record<string, number>[]) {
  const variableElements = variablesToElements(variables, data);
  const regx = /^\{(.+)\}(.*)$/;
  return template.split('$').map((text) => {
    const match = regx.exec(text);
    if (!match) {
      return textToJSX(text);
    }
    const element = variableElements[match[1]];
    if (!element) {
      return textToJSX(text);
    }
    const rest = match[2] ?? '';
    return (
      <>
        {element}
        {textToJSX(rest)}
      </>
    );
  });
}
export function templateToString(template: string, variables: ITemplateVariable[], data: Record<string, number>[]) {
  const variableStrings = variablesToStrings(variables, data);
  const regx = /^\{(.+)\}(.*)$/;
  return template.split('$').map((text) => {
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
  });
}
