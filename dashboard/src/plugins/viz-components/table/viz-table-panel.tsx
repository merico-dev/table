import { ActionIcon, Divider, Group, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Prism } from '@mantine/prism';
import { defaults } from 'lodash';
import { useEffect } from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { useStorageData } from '~/plugins/hooks';
import { AnyObject } from '~/types';
import { VizConfigProps } from '~/types/plugin';
import { ColumnsField } from './editors/columns';
import { StylingFields } from './editors/styling';
import { DEFAULT_CONFIG, ITableConf } from './type';

export function VizTablePanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<ITableConf>(context.instanceData, 'config');
  const form = useForm({
    initialValues: DEFAULT_CONFIG,
  });
  useEffect(() => {
    const updated = defaults({}, conf, form.values, DEFAULT_CONFIG);
    if (conf) {
      form.setValues(updated);
    }
  }, [conf]);
  const data = (context.data || []) as AnyObject[];

  return (
    <form
      onSubmit={form.onSubmit(async (val) => {
        await setConf(val);
      })}
    >
      <Stack mt="md" spacing={10}>
        <Group position="apart" sx={{ position: 'relative' }}>
          <Text>Table Config</Text>
          <ActionIcon type="submit" aria-label="save config" mr={5} variant="filled" color="blue">
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>

        <Divider mt={10} mb={-10} variant="dashed" label="Data" labelPosition="center" />
        <DataFieldSelector label="ID Field" required data={data} {...form.getInputProps('id_field')} />

        <Divider mt={10} mb={-10} variant="dashed" label="Style" labelPosition="center" />
        <StylingFields form={form} />

        <Divider mt={10} mb={0} variant="dashed" label="Columns" labelPosition="center" />
        <ColumnsField form={form} data={data} />

        <Text weight={500} mb="md">
          Current Configuration:
        </Text>
        <Prism language="json" colorScheme="dark" noCopy>
          {JSON.stringify(form.values, null, 2)}
        </Prism>
      </Stack>
    </form>
  );
}
