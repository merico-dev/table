import { Stack, Tabs } from '@mantine/core';
import { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { RegressionField } from './editors/regression-field';
import { XAxisField } from './editors/x-axis';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IRegressionChartConf } from './type';

export function VizRegressionChartEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRegressionChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis', 'regression']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);
  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={changed} />
        <Tabs
          defaultValue="X轴"
          orientation="vertical"
          styles={{
            panel: {
              paddingTop: '6px',
              paddingLeft: '12px',
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="X轴">X轴</Tabs.Tab>
            <Tabs.Tab value="Y轴">Y轴</Tabs.Tab>
            <Tabs.Tab value="回归">回归</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X轴">
            <XAxisField watch={watch} control={control} />
          </Tabs.Panel>
          <Tabs.Panel value="Y轴">
            <YAxisField watch={watch} control={control} />
          </Tabs.Panel>
          <Tabs.Panel value="回归">
            <RegressionField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
