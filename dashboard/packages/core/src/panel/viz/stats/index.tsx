import { Text } from '@mantine/core';
import numbro from 'numbro';
import _ from "lodash";
import React from 'react';
import { ColorConf } from './types';
import { InterpolateColor } from '../../../utils/color-mapping';

function interpolateString(template: string, params: Record<string, any> = {}) {
  const extendedParams = { ...params, numbro }
  const names = Object.keys(extendedParams);
  const vals = Object.values(extendedParams);
  try {
    return new Function(...names, `return \`${template}\`;`)(...vals);
  } catch (error: any) {
    return error.message;
  }
}

function getColorByColorConf(conf: ColorConf, value: number) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    const mapper = new InterpolateColor(conf);
    return mapper.getColor(value);
  }
  return 'black'
}

interface IVizStats {
  conf: any;
  data: any;
  width: number;
  height: number;
}

export function VizStats({ conf: { template, size, color, value_field, ...rest }, data }: IVizStats) {
  const finalColor = React.useMemo(() => {
    return getColorByColorConf(color, data[0][value_field]);
  }, [color, data, value_field]);

  return (
    <Text {...rest} color={finalColor} sx={{ fontSize: size }}>{interpolateString(template, data[0])}</Text>
  )
}