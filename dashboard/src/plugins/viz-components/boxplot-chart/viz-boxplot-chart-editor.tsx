import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { ReferenceLinesField } from './editors/reference-lines';
import { XAxisField } from './editors/x-axis';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';
import { TooltipField } from './editors/tooltip';

export function VizBoxplotChartEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IBoxplotChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis', 'reference_lines', 'color']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Tabs
          defaultValue="X Axis"
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
            <Tabs.Tab value="X Axis">X Axis</Tabs.Tab>
            <Tabs.Tab value="Y Axis">Y Axis</Tabs.Tab>
            <Tabs.Tab value="Tooltip">Tooltip</Tabs.Tab>
            <Tabs.Tab value="Style">Style</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">Reference Lines</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Y Axis">
            <YAxisField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Style">
            <Stack spacing={4}>
              <Text size="sm">Color</Text>
              <Controller name="color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="Reference Lines">
            <ReferenceLinesField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
