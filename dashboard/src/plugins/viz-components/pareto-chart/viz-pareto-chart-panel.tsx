import { ActionIcon, Group, Tabs, Text } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { EchartsZoomingField } from '../cartesian/panel/echarts-zooming-field';
import { BarField } from './editors/bar';
import { LineField } from './editors/line';
import { XAxisField } from './editors/x-axis';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IParetoChartConf } from './type';

export function VizParetoChartPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IParetoChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IParetoChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'data_key', 'bar', 'line', 'dataZoom']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
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
          <Tabs.Tab value="Bar">Bar</Tabs.Tab>
          <Tabs.Tab value="Line">Line</Tabs.Tab>
          <Tabs.Tab value="Zooming">Zooming</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="X Axis">
          <XAxisField control={control} watch={watch} data={data} />
        </Tabs.Panel>

        <Tabs.Panel value="Y Axis">
          <YAxisField control={control} watch={watch} data={data} />
        </Tabs.Panel>

        <Tabs.Panel value="Bar">
          <BarField control={control} watch={watch} data={data} />
        </Tabs.Panel>

        <Tabs.Panel value="Line">
          <LineField control={control} watch={watch} data={data} />
        </Tabs.Panel>

        <Tabs.Panel value="Zooming">
          <Controller name="dataZoom" control={control} render={({ field }) => <EchartsZoomingField {...field} />} />
        </Tabs.Panel>
      </Tabs>
    </form>
  );
}
