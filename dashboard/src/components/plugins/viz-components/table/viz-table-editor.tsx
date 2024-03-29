import { ActionIcon, Divider, Group, Tabs, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { ColumnsField } from './editors/columns';
import { StylingFields } from './editors/styling';
import { DEFAULT_CONFIG, ITableConf } from './type';

// FIXME: migrator to version 2 in index.ts doesn't work
function tempMigration({ columns, ...rest }: ITableConf) {
  return {
    ...rest,
    columns: columns.map(({ id, ...restColumn }) => ({
      id: id ?? randomId(),
      ...restColumn,
    })),
  };
}

export function VizTableEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ITableConf>(context.instanceData, 'config');
  // const { variables } = context;
  const conf: ITableConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ITableConf = useMemo(() => {
    return tempMigration(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ITableConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  watch(['id_field']);
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Group position="apart" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text>Table Config</Text>
        <ActionIcon type="submit" aria-label="save config" mr={5} variant="filled" color="blue" disabled={!changed}>
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
          <Tabs.Tab value="Columns">Columns</Tabs.Tab>
          <Tabs.Tab value="Style">Style</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Columns">
          <Controller
            name="id_field"
            control={control}
            render={({ field }) => <DataFieldSelector label="ID Field" required {...field} />}
          />
          <Divider mt={20} mb={10} variant="dashed" />
          <ColumnsField control={control} watch={watch} />
        </Tabs.Panel>

        <Tabs.Panel value="Style">
          <StylingFields control={control} watch={watch} />
        </Tabs.Panel>
      </Tabs>
    </form>
  );
}
