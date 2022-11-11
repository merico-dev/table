import { Group, Stack, TextInput } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { MetricSetSelector } from './metric-set-selector';
import { ScenarioSelector } from './scenario-selector';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

export function VizExpertSystemPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const conf: IExpertSystemConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const setURL = (v: string) => {
    setConf({
      ...conf,
      expertSystemURL: v,
    });
  };
  return (
    <Stack>
      <TextInput
        value={conf.expertSystemURL}
        onChange={(e) => {
          setURL(e.currentTarget.value);
        }}
        label="Expert System URL"
        required
      />
      <Group grow>
        <ScenarioSelector conf={conf} setConf={setConf} />
        <MetricSetSelector conf={conf} setConf={setConf} />
      </Group>
    </Stack>
  );
}
