import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import _, { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { HeatBlockField } from './editors/heat_block';
import { TooltipField } from './editors/tooltip';
import { CalendarField } from './editors/calendar';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';

export function VizCalendarHeatmapEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ICalendarHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const conf: ICalendarHeatmapConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ICalendarHeatmapConf = useMemo(() => {
    return _.cloneDeep(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ICalendarHeatmapConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Calendar Heatmap Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Tabs
          defaultValue="Calendar"
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
            <Tabs.Tab value="Calendar">Calendar</Tabs.Tab>
            <Tabs.Tab value="Heat Block">Heat Block</Tabs.Tab>
            <Tabs.Tab value="Tooltip">Tooltip</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Calendar">
            <CalendarField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Heat Block">
            <HeatBlockField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} data={data} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
