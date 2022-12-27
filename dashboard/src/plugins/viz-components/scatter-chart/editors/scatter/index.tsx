import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { IScatterChartConf } from '../../type';
import { ScatterSizeSelect } from './scatter-size-select';

interface IScatterField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: $TSFixMe[];
}
export function ScatterField({ data, control, watch }: IScatterField) {
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="scatter.name_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Name Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="scatter.y_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Value Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} label="Style" labelPosition="center" />
      <Controller
        name={`scatter.symbolSize`}
        control={control}
        render={({ field }) => <ScatterSizeSelect label="Size" data={data} {...field} />}
      />
      <Divider mb={-15} label="Label" labelPosition="center" />
      <Group grow noWrap></Group>
    </Stack>
  );
}
