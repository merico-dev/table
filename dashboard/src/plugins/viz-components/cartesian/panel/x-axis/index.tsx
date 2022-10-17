import { Group, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { ICartesianChartConf } from '../../type';

interface IXAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  data: $TSFixMe[];
}
export function XAxisField({ data, control, watch }: IXAxisField) {
  watch(['x_axis_data_key', 'x_axis_name']);
  return (
    <Group grow noWrap>
      <Controller
        name="x_axis_data_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
        )}
      />
      <Controller
        name="x_axis_name"
        control={control}
        render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
      />
    </Group>
  );
}
