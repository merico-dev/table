import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IParetoChartConf } from '../type';

interface IYAxisField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function YAxisField({ control, watch }: IYAxisField) {
  watch(['data_key']);
  return (
    <Stack>
      <Controller
        name="data_key"
        control={control}
        render={({ field }) => <DataFieldSelector label="Y Axis Data Field" required sx={{ flex: 1 }} {...field} />}
      />
    </Stack>
  );
}
