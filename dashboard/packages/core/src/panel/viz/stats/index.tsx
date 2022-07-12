import { Text } from '@mantine/core';
import numbro from 'numbro';
import _ from "lodash";
import React from 'react';
import { ColorConf, IVizStatsConf, IVizStatsVariable } from './types';
import { InterpolateColor } from '../../../utils/color-mapping';

function getColorByColorConf(conf: ColorConf, value: number) {
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

function variablesToElements(variables: IVizStatsVariable[], data: Record<string, number>[]) {
  const ret: Record<string, React.ReactNode> = {};
  variables.forEach(({ name, color, data_field, size, weight, formatter }) => {
    const value: number = data[0]?.[data_field];
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

interface IVizStats {
  conf: IVizStatsConf;
  data: any;
  width: number;
  height: number;
}

export function VizStats({ conf: { template, variables, align }, data }: IVizStats) {
  const contents = React.useMemo(() => {
    const regx = /\$\{(.+)\}(.*)/;
    const variableElements = variablesToElements(variables, data);
    return template.split(' ').map(text => {
      if (['<br/>', '<br />', '\n'].includes(text)) {
        return <br/>
      }
      if (!text.includes('${')) {
        return text;
      }
      const match = regx.exec(text);
      if (!match) {
        return text;
      }
      const element = variableElements[match[1]];
      if (!element) {
        return text;
      }
      const rest = match[2] ?? '';
      return <>{element}{rest}</>;
    });
  }, [template, variables, data])

  return (
    <Text align={align}>
      {Object.values(contents).map(c => (
        <>{c} </>
      ))}
    </Text>
  )
}