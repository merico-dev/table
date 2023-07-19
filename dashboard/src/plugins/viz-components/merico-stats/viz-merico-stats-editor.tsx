import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';

import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { MetricsField } from './editors/metrics';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';
import { StylesField } from './editors/styles';

export function VizMericoStatsEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<TMericoStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: TMericoStatsConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<TMericoStatsConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Merico Stats Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <StylesField control={control} watch={watch} />
        <MetricsField control={control} watch={watch} variables={variables} />
      </Stack>
    </form>
  );
}
