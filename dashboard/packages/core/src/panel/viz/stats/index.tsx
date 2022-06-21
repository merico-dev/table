import { Text } from '@mantine/core';
import numbro from 'numbro';
import _ from "lodash";
import React from 'react';
import { ColorConf, IVizStatsConf } from './types';
import { InterpolateColor } from '../../../utils/color-mapping';

function getColorByColorConf(conf: ColorConf, dataRow: Record<string, number>) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    const mapper = new InterpolateColor(conf);
    const value = dataRow[conf.valueField];
    return mapper.getColor(value);
  }
  return 'black'
}

interface IVizStats {
  conf: IVizStatsConf;
  data: any;
  width: number;
  height: number;
}

export function VizStats({ conf: { content, size, color, ...rest }, data }: IVizStats) {
  const finalColor = React.useMemo(() => {
    return getColorByColorConf(color, data[0]);
  }, [color, data]);

  const finalContent = React.useMemo(() => {
    const { prefix, postfix, data_field, formatter } = content;
    const contentData = data?.[0]?.[data_field];
    const contents = [
      prefix,
      numbro(contentData).format(formatter),
      postfix,
    ]
    return contents.join(' ');
  }, [content, data])

  return (
    <Text {...rest} color={finalColor} sx={{ fontSize: size }}>{finalContent}</Text>
  )
}