import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import _, { defaultsDeep } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, IPieChartConf } from './type';

export function VizPieChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IPieChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const conf: IPieChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: IPieChartConf = useMemo(() => _.clone(conf), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IPieChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  watch(['label_field', 'value_field']);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Pie Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Stack mt="md" spacing="xs" p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <Controller
            control={control}
            name="label_field"
            render={({ field }) => <DataFieldSelector label="Label Key" required data={data} {...field} />}
          />
          <Controller
            control={control}
            name="value_field"
            render={({ field }) => <DataFieldSelector label="Value Key" required data={data} {...field} />}
          />
        </Stack>
      </form>
    </Stack>
  );
}
