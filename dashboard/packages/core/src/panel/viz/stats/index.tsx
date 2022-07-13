import { Text } from '@mantine/core';
import _ from "lodash";
import React from 'react';
import { templateToJSX } from '../../../utils/template/render';
import { IVizStatsConf } from './types';

interface IVizStats {
  conf: IVizStatsConf;
  data: any;
  width: number;
  height: number;
}

export function VizStats({ conf: { template, variables, align }, data }: IVizStats) {
  const contents = React.useMemo(() => {
    return templateToJSX(template, variables, data);
  }, [template, variables, data])

  return (
    <Text align={align}>
      {Object.values(contents).map(c => c)}
    </Text>
  )
}