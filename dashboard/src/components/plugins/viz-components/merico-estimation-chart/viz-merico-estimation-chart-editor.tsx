import { Stack, Tabs } from '@mantine/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { useStorageData } from '../../hooks';
import { DeviationField } from './editors/deviation';
import { MetricsField } from './editors/metrics';
import { XAxisField } from './editors/x_axis';
import { DEFAULT_CONFIG, IMericoEstimationChartConf } from './type';

export function VizMericoEstimationChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IMericoEstimationChartConf>(context.instanceData, 'config');
  const { variables } = context;
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
        <VizConfigBanner canSubmit={changed} />
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
            <Tabs.Tab value="X Axis">X轴</Tabs.Tab>
            <Tabs.Tab value="Deviation">偏差</Tabs.Tab>
            <Tabs.Tab value="Additional Metrics">指标</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Deviation">
            <DeviationField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Additional Metrics">
            <MetricsField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
