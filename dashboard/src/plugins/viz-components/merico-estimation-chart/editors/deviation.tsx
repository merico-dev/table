import { Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { IMericoEstimationChartConf } from '../type';

interface IDeviationField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  watch: UseFormWatch<IMericoEstimationChartConf>;
  data: TVizData;
}
export function DeviationField({ data, control, watch }: IDeviationField) {
  watch(['deviation']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="deviation.name"
          control={control}
          render={({ field }) => <TextInput label="指标名称" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name="deviation.data_keys.estimated_value"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="估算值字段" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="deviation.data_keys.actual_value"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="实际值字段" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
