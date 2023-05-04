import { Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { IMericoEstimationChartConf } from '../type';

interface IYAxisField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  watch: UseFormWatch<IMericoEstimationChartConf>;
  data: TVizData;
}
export function YAxisField({ data, control, watch }: IYAxisField) {
  watch(['y_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label="指标名称" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.data_keys.estimated_level"
          control={control}
          render={({ field }) => <DataFieldSelector label="估算值档位" data={data} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name="y_axis.data_keys.actual_level"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="实际值档位" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="y_axis.data_keys.diff_level"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="档位偏差" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
