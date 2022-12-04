import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickEchartSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-echart:series',
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
      description: `'line' | 'scatter' | 'bar'`,
      valueType: 'string',
    },
    {
      name: 'componentSubType',
      description: `'line' | 'scatter' | 'bar'`,
      valueType: 'string',
    },
    {
      name: 'componentType',
      description: `'series'`,
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
      description: `String-typed number, or series' actual value`,
      valueType: 'string',
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
  return <Text>Click this chart</Text>;
}
