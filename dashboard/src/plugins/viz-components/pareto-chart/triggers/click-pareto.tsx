import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickParetoSeries: ITriggerSchema = {
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
      description: `'line' | 'bar'`,
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
      name: 'rowData',
      description: `Data of the row`,
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
