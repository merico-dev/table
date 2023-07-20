import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '../../../../types/plugin';
import { useStorageData } from '../../hooks';
import { ReferenceLinesField } from './editors/reference-lines';
import { SeriesField } from './editors/series';
import { XAxesField } from './editors/x-axes';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IHorizontalBarChartConf } from './type';

export function VizHorizontalBarChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IHorizontalBarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IHorizontalBarChartConf = useMemo(() => _.defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IHorizontalBarChartConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  watch([]);
  const values = getValues();
  const changed = useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Horizontal Bar Chart Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Tabs
          defaultValue="Series"
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
            <Tabs.Tab value="X Axes">X Axes</Tabs.Tab>
            <Tabs.Tab value="Y Axis">Y Axis</Tabs.Tab>
            <Tabs.Tab value="Series">Series</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">Reference Lines</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axes">
            <XAxesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Y Axis">
            <YAxisField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Series">
            <SeriesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Reference Lines">
            <ReferenceLinesField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
