import { Text } from '@mantine/core';
import { ITriggerConfigProps, ITriggerSchema } from '~/types/plugin';

export const ClickEchart: ITriggerSchema = {
  id: 'builtin:echarts:click-echart',
  displayName: 'Click Chart',
  nameRender: ClickEchartName,
  configRender: ClickEchartSettings,
  payload: [],
};

export interface IClickButtonConfig {
  foo: '';
}

export function ClickEchartSettings(props: ITriggerConfigProps) {
  return <></>;
}

function ClickEchartName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  return <Text>Click this chart</Text>;
}
