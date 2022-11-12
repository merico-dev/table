import { Group, Stack, TextInput } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { MetricSetSelector } from './metric-set-selector';
import { ScenarioSelector } from './scenario-selector';
import { DEFAULT_CONFIG, EExperSystemScenario, IExpertSystemConf } from './type';

export function VizExpertSystemPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const conf: IExpertSystemConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const setConfByKey = (key: string, value: IExpertSystemConf[keyof IExpertSystemConf]) => {
    setConf({
      ...conf,
      [key]: value,
    });
  };

  return (
    <Stack>
      <TextInput
        value={conf.expertSystemURL}
        onChange={(e) => {
          setConfByKey('expertSystemURL', e.currentTarget.value);
        }}
        label="Expert System URL"
        required
      />
      <Group grow>
        <ScenarioSelector conf={conf} setConfByKey={setConfByKey} />
        <MetricSetSelector conf={conf} setConfByKey={setConfByKey} />
      </Group>
    </Stack>
  );
}
