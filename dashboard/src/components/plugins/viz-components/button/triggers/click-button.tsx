import { Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickButton: ITriggerSchema = {
  id: 'builtin:button:click-button',
  displayName: 'viz.button.click.label',
  nameRender: ClickButtonName,
  configRender: ClickButtonSettings,
  payload: [],
};

export interface IClickButtonConfig {
  foo: '';
}

export function ClickButtonSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickButtonName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { t } = useTranslation();
  return <Text>{t('viz.button.click.label')}</Text>;
}
