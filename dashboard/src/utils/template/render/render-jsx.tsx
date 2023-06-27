import { Text } from '@mantine/core';
import React from 'react';
import { aggregateValue } from '../../aggregation';
import { InterpolateColor } from '../../color-mapping';
import { ColorConfType, ITemplateVariable } from '../types';
import { formatAggregatedValue } from '../utils';

function getColorByColorConf(conf: ColorConfType, value: number | number[] | null | string) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    try {
      if (typeof value !== 'number') {
        throw new Error(`[getColorByColorConf] Invalid type of aggregated value: ${value}`);
      }
      return new InterpolateColor(conf).getColor(value);
    } catch (error) {
      console.error(error);
      return 'black';
    }
  }
  return 'black';
}

export function variable2Jsx(variable: ITemplateVariable, data: TPanelData) {
  const { color, data_field, aggregation, size, weight } = variable;
  const value = aggregateValue(data, data_field, aggregation);
  const valueContent = formatAggregatedValue(variable, value);
  const text = (
    <Text sx={{ fontSize: size, display: 'inline' }} color={getColorByColorConf(color, value)} weight={weight}>
      {valueContent}
    </Text>
  );
  return text;
}

function variablesToElements(variables: ITemplateVariable[], data: TPanelData) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach((variable) => {
    const name = variable.name;
    ret[name] = variable2Jsx(variable, data);
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
        arr.push(<br key={`br-${i}`} />);
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

export function templateToJSX(template: string, variables: ITemplateVariable[], data: TPanelData) {
  const variableElements = variablesToElements(variables, data);
  const regx = /^\{(.+)\}(.*)$/;
  return template.split('$').map((text, index) => {
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
      <React.Fragment key={`${text}-${index}`}>
        {element}
        {textToJSX(rest)}
      </React.Fragment>
    );
  });
}
