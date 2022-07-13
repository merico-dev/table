import numbro from "numbro";
import { Text } from "@mantine/core";
import { aggregateValue } from "../aggregation";
import { InterpolateColor } from "../color-mapping";
import { ColorConfType, ITemplateVariable } from "./types";

function getColorByColorConf(conf: ColorConfType, value: number) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    return new InterpolateColor(conf).getColor(value);
  }
  return 'black'
}

function getNonStatsDataText(data: any) {
  if (data === null) {
    return 'null';
  }
  if (data === undefined) {
    return 'undefined'
  }
  if (Array.isArray(data)) {
    return `Array(${data.length})`
  }
  return data.toString()
}

function variablesToElements(variables: ITemplateVariable[], data: Record<string, number>[]) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach(({ name, color, data_field, aggregation, size, weight, formatter }) => {
    const value: number = aggregateValue(data, data_field, aggregation);
    console.log(value, data_field, aggregation);
    let valueContent = ''
    if (!['string', 'number'].includes(typeof value)) {
      valueContent = getNonStatsDataText(value);
    } else {
      valueContent = numbro(value).format(formatter);
    }
    ret[name] = <Text sx={{ fontSize: size, display: 'inline' }} color={getColorByColorConf(color, value)} weight={weight}>{valueContent}</Text>;
  })
  return ret;
}

function withWhiteSpaces(text: string) {
  return text.split(' ').map(s => {
    if (!s) {
      return <>&nbsp;</>
    }
    return s
  })
}

function withLineBreaks(text: string) {
  const normalized = text.replaceAll('<br />', '<br/>').replaceAll('\n', '<br/>');
  const splitted = normalized.split('<br/>');
  const ret = splitted.map((t, i) => {
    const arr: Array<React.ReactNode> = [
      withWhiteSpaces(t)
    ];
    if (i !== splitted.length - 1) {
      arr.push(<br/>)
    }
    return arr;
  }).flat().filter(t => t !== undefined)
  return ret;
}

function textToJSX(text: string) {
  return withLineBreaks(text);
}

export function templateToJSX(template: string, variables: ITemplateVariable[], data: Record<string, number>[]) {
  const variableElements = variablesToElements(variables, data);
  const regx = /^\{(.+)\}(.*)$/;
  return template.split('$').map(text => {
    const match = regx.exec(text);
    if (!match) {
      return textToJSX(text);
    }
    const element = variableElements[match[1]];
    if (!element) {
      return textToJSX(text);
    }
    const rest = match[2] ?? '';
    return <>{element}{textToJSX(rest)}</>;
  });
}