import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';

import { IconDeviceFloppy } from '@tabler/icons-react';
import { DEFAULT_CONFIG, IBar3dChartConf } from './type';

export function VizBar3dChartEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IBar3dChartConf>(context.instanceData, 'config');
  const defaultValues = defaults({}, conf, DEFAULT_CONFIG);
  const { control, handleSubmit, reset } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [conf]);

  if (!conf) {
    return null;
  }

  return (
    <Stack gap="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Text>X Axis</Text>
        <Group justify="space-between" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name="x_axis_data_key"
            control={control}
            render={({ field }) => <DataFieldSelector label="Data Field" required {...field} />}
          />
          <Controller
            name="xAxis3D.name"
            control={control}
            render={({ field }) => <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />}
          />
        </Group>

        <Text mt="lg">Y Axis</Text>
        <Group justify="space-between" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name="y_axis_data_key"
            control={control}
            render={({ field }) => <DataFieldSelector label="Data Field" required {...field} />}
          />
          <Controller
            name="yAxis3D.name"
            control={control}
            render={({ field }) => <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />}
          />
        </Group>

        <Text mt="lg">Z Axis</Text>
        <Group justify="space-between" grow p="md" sx={{ position: 'relative', border: '1px solid #eee' }}>
          <Controller
            name="z_axis_data_key"
            control={control}
            render={({ field }) => <DataFieldSelector label="Data Field" required {...field} />}
          />
          <Controller
            name="zAxis3D.name"
            control={control}
            render={({ field }) => <TextInput sx={{ flexGrow: 1 }} size="md" label="Name" {...field} />}
          />
        </Group>
        <Group justify="center" mt="xl" grow sx={{ width: '60%' }} mx="auto">
          <Button color="blue" type="submit">
            <IconDeviceFloppy size={20} />
            <Text ml="md">Save</Text>
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
