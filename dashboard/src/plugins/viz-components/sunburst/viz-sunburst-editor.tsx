import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import _, { defaultsDeep } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DataField } from './editors/data-field';
import { DEFAULT_CONFIG, ISunburstConf } from './type';

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

  const [tab, setTab] = useState<string | null>('Data');
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack mt="md" spacing="xs">
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Sunburst Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Tabs
          value={tab}
          onTabChange={setTab}
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
            <Tabs.Tab value="Levels">Levels</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Data">
            <DataField control={control} watch={watch} data={data} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
