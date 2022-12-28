import { ActionIcon, Divider, Group, Stack, Tabs, Text } from '@mantine/core';
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
      <Group position="apart" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text>Table Config</Text>
        <ActionIcon type="submit" aria-label="save config" mr={5} variant="filled" color="blue">
          <DeviceFloppy size={20} />
        </ActionIcon>
      </Group>
      <Tabs
        defaultValue="Columns"
        orientation="vertical"
        styles={{
          tab: {
            paddingLeft: '6px',
            paddingRight: '6px',
          },
          panel: {
            paddingTop: '6px',
            paddingLeft: '12px',
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="Data">Data</Tabs.Tab>
          <Tabs.Tab value="Style">Style</Tabs.Tab>
          <Tabs.Tab value="Columns">Columns</Tabs.Tab>
          <Tabs.Tab value="Config JSON">Config JSON</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Data">
          <DataFieldSelector label="ID Field" required data={data} {...form.getInputProps('id_field')} />
        </Tabs.Panel>
        <Tabs.Panel value="Style">
          <StylingFields form={form} />
        </Tabs.Panel>
        <Tabs.Panel value="Columns">
          <ColumnsField form={form} data={data} />
        </Tabs.Panel>
        <Tabs.Panel value="Config JSON">
          <Text weight={500} mb="md">
            Current Configuration:
          </Text>
          <Prism language="json" colorScheme="dark" noCopy>
            {JSON.stringify(form.values, null, 2)}
          </Prism>
        </Tabs.Panel>
      </Tabs>
    </form>
  );
}
