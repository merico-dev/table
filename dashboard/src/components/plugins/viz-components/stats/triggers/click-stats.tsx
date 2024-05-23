import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickStats: ITriggerSchema = {
  id: 'builtin:stats:click-stats',
  displayName: 'viz.stats.click_stats.trigger',
  nameRender: ClickStatsName,
  configRender: ClickStatsSettings,
  payload: [
    {
      name: 'variables',
      description: 'Panel variables',
      valueType: 'object',
    },
  ],
};

export interface IClickStatsConfig {
  foo: '';
}

export function ClickStatsSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickStatsName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text>{t('viz.stats.click_stats.trigger')}</Text>;
}
