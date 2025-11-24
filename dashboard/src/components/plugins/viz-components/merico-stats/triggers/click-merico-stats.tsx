import { Text, TextInput } from '@mantine/core';
import { defaults } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickMericoStats: ITriggerSchema = {
  id: 'builtin:merico-stats:click-merico-stats',
  displayName: 'viz.merico_stats.click_merico_stats.trigger',
  nameRender: ClickMericoStatsName,
  configRender: ClickMericoStatsSettings,
  payload: [
    {
      name: 'variables',
      description: 'Panel variables',
      valueType: 'object',
    },
    {
      name: 'metricName',
      description: 'Name of the clicked metric',
      valueType: 'string',
    },
  ],
};

export interface IClickMericoStatsConfig {
  metricName: string;
}

const DEFAULT_CONFIG: IClickMericoStatsConfig = {
  metricName: '',
};

export function ClickMericoStatsSettings(props: ITriggerConfigProps) {
  const { t } = useTranslation();
  const { value: config, set: setConfig } = useStorageData<IClickMericoStatsConfig>(
    props.trigger.triggerData,
    'config',
  );
  const { metricName } = defaults({}, config, DEFAULT_CONFIG);

  const handleMetricNameChange = (value: string) => {
    void setConfig({ metricName: value });
  };

  return (
    <TextInput
      label={t('viz.merico_stats.click_merico_stats.metric_name_label')}
      placeholder={t('viz.merico_stats.click_merico_stats.metric_name_placeholder')}
      value={metricName}
      onChange={(e) => handleMetricNameChange(e.currentTarget.value)}
      description={t('viz.merico_stats.click_merico_stats.metric_name_description')}
    />
  );
}

function ClickMericoStatsName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  const { value: config } = useStorageData<IClickMericoStatsConfig>(props.trigger.triggerData, 'config');
  const { metricName } = defaults({}, config, DEFAULT_CONFIG);

  if (metricName) {
    return <Text size="sm">{t('viz.merico_stats.click_merico_stats.trigger_with_name', { name: metricName })}</Text>;
  }
  return <Text size="sm">{t('viz.merico_stats.click_merico_stats.trigger')}</Text>;
}
