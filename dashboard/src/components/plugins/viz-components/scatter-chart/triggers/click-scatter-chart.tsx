import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickScatterChartSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-scatter-chart:series',
  displayName: 'viz.scatter_chart.click_scatter.trigger',
  nameRender: ClickScatterChartSeriesName,
  configRender: ClickScatterChartSeriesSettings,
  payload: [
    {
      name: 'seriesType',
      description: `"scatter"`,
      valueType: 'string',
    },
    {
      name: 'componentType',
      description: `"series"`,
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

export interface IClickScatterChartSeriesConfig {
  foo: '';
}

export function ClickScatterChartSeriesSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickScatterChartSeriesName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text size="sm">{t('viz.scatter_chart.click_scatter.trigger')}</Text>;
}
