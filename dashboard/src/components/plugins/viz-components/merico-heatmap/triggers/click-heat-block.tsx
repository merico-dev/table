import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export function ClickHeatBlockSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickHeatBlockName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text>{t('viz.merico_heatmap.click_heatmap.heatblock.label')}</Text>;
}

export const ClickHeatBlock: ITriggerSchema = {
  id: 'builtin:echarts:click-heatmap:heat-block',
  displayName: 'viz.merico_heatmap.click_heatmap.heatblock.label',
  nameRender: ClickHeatBlockName,
  configRender: ClickHeatBlockSettings,
  payload: [
    {
      name: 'seriesType',
      description: `'heatmap'`,
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

export interface IClickHeatBlockConfig {
  foo: '';
}
