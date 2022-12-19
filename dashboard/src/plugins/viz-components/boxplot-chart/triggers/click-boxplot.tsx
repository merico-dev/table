import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickBoxplotSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-echart:series', // use same id as cartesian's, but different payload
  displayName: 'Click Chart Series',
  nameRender: ClickEchartSeriesName,
  configRender: ClickEchartSeriesSettings,
  payload: [
    {
      name: 'type',
      description: `Always 'click'`,
      valueType: 'string',
    },
    {
      name: 'seriesType',
      description: `'boxplot'`,
      valueType: 'string',
    },
    {
      name: 'name',
      description: `Name of the series clicked`,
      valueType: 'string',
    },
    {
      name: 'color',
      description: `Color`,
      valueType: 'string',
    },
    {
      name: 'value',
      description: `Record of 'name', 'min', 'q1', 'median', 'q3', 'max'`,
      valueType: 'object',
    },
  ],
};

export interface IClickEchartSeriesConfig {
  foo: '';
}

export function ClickEchartSeriesSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickEchartSeriesName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  return <Text>Click chart's series</Text>;
}
