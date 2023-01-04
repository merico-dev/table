import { Group, Stack, TextInput } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

export function VizMericoGQMPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IMericoGQMConf>(context.instanceData, 'config');
  const conf: IMericoGQMConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const setConfByKey = (key: string, value: IMericoGQMConf[keyof IMericoGQMConf]) => {
    setConf({
      ...conf,
      [key]: value,
    });
  };

  return (
    <Stack>
      <Group grow>
        <TextInput
          value={conf.expertSystemURL}
          onChange={(e) => {
            setConfByKey('expertSystemURL', e.currentTarget.value);
          }}
          label="Expert System URL"
        />
        <TextInput
          label="Path"
          value={conf.path}
          onChange={(e) => {
            setConfByKey('path', e.currentTarget.value);
          }}
          required
        />
      </Group>
      <Group grow>
        <TextInput
          label="Goal"
          value={conf.goal}
          onChange={(e) => {
            setConfByKey('goal', e.currentTarget.value);
          }}
          required
        />
        <TextInput
          label="Question"
          value={conf.question}
          onChange={(e) => {
            setConfByKey('question', e.currentTarget.value);
          }}
          required
        />
      </Group>
    </Stack>
  );
}
