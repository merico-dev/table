import { Accordion, ActionIcon, Divider, Group, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

export function VizParetoChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IParetoChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'data_key', 'bar', 'line']);
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
        <Controller
          name="data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Y Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Divider my="md" label="Bar" labelPosition="center" />
        <Group grow noWrap>
          <Controller
            name="bar.name"
            control={control}
            render={({ field }) => <TextInput label="Bar Name" sx={{ flex: 1 }} {...field} />}
          />
          <Stack spacing={4}>
            <Text size="sm">Bar's Color</Text>
            <Controller
              name="bar.color"
              control={control}
              render={({ field }) => <MantineColorSelector {...field} />}
            />
          </Stack>
        </Group>

        <Divider my="md" label="Line" labelPosition="center" />
        <Group grow noWrap>
          <Controller
            name="line.name"
            control={control}
            render={({ field }) => <TextInput label="Line Name" sx={{ flex: 1 }} {...field} />}
          />
          <Stack spacing={4}>
            <Text size="sm">Line's Color</Text>
            <Controller
              name="line.color"
              control={control}
              render={({ field }) => <MantineColorSelector {...field} />}
            />
          </Stack>
        </Group>
      </form>
    </Stack>
  );
}
