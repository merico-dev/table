import { ActionIcon, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '../../../panel/settings/common/data-field-selector';
import { MantineColorSelector } from '../../../panel/settings/common/mantine-color';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';

export function VizBoxplotChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const data = context.data as any[];
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IBoxplotChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Divider label="X Axis" labelPosition="center" mt="md" />
        <Group grow noWrap>
          <Controller
            name="x_axis.name"
            control={control}
            render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
          />
          <Controller
            name="x_axis.data_key"
            control={control}
            render={({ field }) => (
              <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
            )}
          />
        </Group>
        <Divider label="Y Axis" labelPosition="center" mt="md" />
        <Group grow noWrap>
          <Controller
            name="y_axis.name"
            control={control}
            render={({ field }) => <TextInput label="Y Axis Name" sx={{ flex: 1 }} {...field} />}
          />
          <Controller
            name="y_axis.data_key"
            control={control}
            render={({ field }) => (
              <DataFieldSelector label="Y Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
            )}
          />
        </Group>
        <Divider label="Style" labelPosition="center" mt="md" />
        <Stack spacing={4}>
          <Text size="sm">Color</Text>
          <Controller name="color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
        </Stack>
      </form>
    </Stack>
  );
}
