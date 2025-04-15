import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickHorizontalBarChartSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-echart:series',
  displayName: 'viz.cartesian_chart.click_series.label',
  nameRender: ClickHorizontalBarChartSeriesName,
  configRender: ClickHorizontalBarChartSeriesSettings,
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

export interface IClickHorizontalBarChartSeriesConfig {
  foo: '';
}

export function ClickHorizontalBarChartSeriesSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickHorizontalBarChartSeriesName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text size="sm">{t('viz.cartesian_chart.click_series.label')}</Text>;
}
