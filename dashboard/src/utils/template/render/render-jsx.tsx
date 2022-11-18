import { Text } from '@mantine/core';
import React from 'react';
import { aggregateValue } from '../../aggregation';
import { InterpolateColor } from '../../color-mapping';
import { ColorConfType, ITemplateVariable } from '../types';
import { formatAggregatedValue } from '../utils';

function getColorByColorConf(conf: ColorConfType, value: number) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    return new InterpolateColor(conf).getColor(value);
  }
  return 'black';
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
  return text.split(' ').map((s, i) => <React.Fragment key={i}>{s}&nbsp;</React.Fragment>);
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
