import { Divider, Group, Select, Stack, Text } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { IScatterChartConf } from '../../type';
import { ScatterSizeSelect } from './scatter-size-select';

const labelPositions = [
  { label: 'off', value: '' },
  { label: 'top', value: 'top' },
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
  { label: 'bottom', value: 'bottom' },
  { label: 'inside', value: 'inside' },
  { label: 'insideLeft', value: 'insideLeft' },
  { label: 'insideRight', value: 'insideRight' },
  { label: 'insideTop', value: 'insideTop' },
  { label: 'insideBottom', value: 'insideBottom' },
  { label: 'insideTopLeft', value: 'insideTopLeft' },
  { label: 'insideBottomLeft', value: 'insideBottomLeft' },
  { label: 'insideTopRight', value: 'insideTopRight' },
  { label: 'insideBottomRight', value: 'insideBottomRight' },
];

interface IScatterField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: $TSFixMe[];
}
export function ScatterField({ data, control, watch }: IScatterField) {
  watch(['scatter']);
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
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`scatter.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Divider mb={-15} label="Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`scatter.label_position`}
          control={control}
          render={({ field }) => <Select label="Label Position" data={labelPositions} {...field} />}
        />
      </Group>
    </Stack>
  );
}
