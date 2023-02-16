import { Group, Stack, Text, ActionIcon } from '@mantine/core';
import { defaults, defaultsDeep } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, ISunburstConf } from './type';
import _ from 'lodash';

export function VizSunburstEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ISunburstConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const conf: ISunburstConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ISunburstConf = useMemo(() => _.clone(conf), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ISunburstConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  watch(['label_key', 'value_key', 'group_key']);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack mt="md" spacing="xs">
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Sunburst Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="label_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Label Key" required data={data} {...field} />}
        />
        <Controller
          name="value_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Key" required data={data} {...field} />}
        />
        <Controller
          name="group_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Group Key" data={data} clearable {...field} />}
        />
      </Stack>
    </form>
  );
}
