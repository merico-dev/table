import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickButton: ITriggerSchema = {
  id: 'builtin:button:click-button',
  displayName: 'Click Button',
  nameRender: ClickButtonName,
  configRender: ClickButtonSettings,
  payload: [
    {
      name: 'filters',
      description: 'Filter values',
      valueType: 'object',
    },
    {
      name: 'context',
      description: 'Context values',
      valueType: 'object',
    },
  ],
};

export interface IClickButtonConfig {
  foo: '';
}

export function ClickButtonSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickButtonName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  return <Text>Click this button</Text>;
}
