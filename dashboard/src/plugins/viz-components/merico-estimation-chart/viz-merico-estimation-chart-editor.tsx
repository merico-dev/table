import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { AnyObject } from '~/types';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';
import { XAxisField } from './editors/x_axis';
import { DeviationField } from './editors/deviation';
import { MetricsField } from './editors/metrics';

export function VizMericoEstimationChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as AnyObject[];
  const conf: IMericoEstimationChartConf = useMemo(() => _.defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IMericoEstimationChartConf>({
    defaultValues: conf,
  });
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
          <Text>Merico Estimation Chart Config</Text>
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
              paddingRight: '12px',
            },
            panel: {
              paddingTop: '6px',
              paddingLeft: '12px',
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="X Axis">X 轴</Tabs.Tab>
            <Tabs.Tab value="Deviation">偏差</Tabs.Tab>
            <Tabs.Tab value="Additional Metrics">指标</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} data={data} />
          </Tabs.Panel>
          <Tabs.Panel value="Deviation">
            <DeviationField control={control} watch={watch} data={data} />
          </Tabs.Panel>
          <Tabs.Panel value="Additional Metrics">
            <MetricsField control={control} watch={watch} data={data} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
