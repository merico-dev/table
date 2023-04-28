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
      <Controller
        name="y_axis.name"
        control={control}
        render={({ field }) => <TextInput label="Name" sx={{ flex: 1 }} {...field} />}
      />
      <Group grow noWrap>
        <Controller
          name="y_axis.data_keys.estimated"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Estimated Value" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="y_axis.data_keys.actual"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Actual Value" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
