import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export function ClickRadarChartSeriesSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickRadarChartSeriesName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text>{t('viz.radar_chart.click_series.label')}</Text>;
}

export const ClickRadarChartSeries: ITriggerSchema = {
  id: 'builtin:echarts:click-radar-chart:series',
  displayName: 'viz.radar_chart.click_series.label',
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
