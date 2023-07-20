import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickPieChart: ITriggerSchema = {
  id: 'builtin:echarts:click-pie-chart:series',
  displayName: 'Click Pie Series',
  nameRender: ClickPieChartName,
  configRender: ClickPieChartSettings,
  payload: [
    {
      name: 'seriesType',
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
      description: 'Value of the series clicked',
      valueType: 'number',
    },
    {
      name: 'rowData',
      description: `Data of the row`,
      valueType: 'object',
    },
  ],
};

export interface IClickPieChartConfig {
  foo: '';
}

export function ClickPieChartSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickPieChartName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  return <Text>Click chart's series</Text>;
}
