import { Divider, Stack } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { RegressionField } from './editors/regression-field';
import { IRegressionChartConf } from './type';

export function VizRegressionChartEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IRegressionChartConf>(context.instanceData, 'config');
  const defaultValues = useMemo(() => defaults({}, conf), [conf]);

  const { control, handleSubmit, watch, formState, reset } = useForm<IRegressionChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'regression']);
  if (!conf) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={formState.isDirty} />
      <Stack gap="xs">
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="默认X轴数据字段" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="regression.y_axis_data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="默认Y轴数据字段" required sx={{ flex: 1 }} {...field} />}
        />
        <Divider variant="dashed" />
        <RegressionField control={control} watch={watch} />
      </Stack>
    </form>
  );
}
