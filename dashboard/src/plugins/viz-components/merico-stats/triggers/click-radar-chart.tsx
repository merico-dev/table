import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export function ClickRadarChartSeriesSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickRadarChartSeriesName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  return <Text>Click heat block</Text>;
}

export const ClickRadarChartSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-merico-stats:series',
  displayName: 'Click radar chart series',
  nameRender: ClickRadarChartSeriesName,
  configRender: ClickRadarChartSeriesSettings,
  payload: [
    {
      name: 'seriesType',
      description: `'radar'`,
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
    {
      name: 'rowData',
      description: `Data of the row`,
      valueType: 'object',
    },
  ],
};

export interface IClickRadarChartSeriesConfig {
  foo: '';
}
