import { Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { ICartesianChartConf } from '../../type';
import { XAxisLabelFormatterField } from './x-axis-label-formatter';

const XAxisTypeOptions = [
  { label: 'value', value: 'value' },
  { label: 'category', value: 'category' },
  { label: 'time', value: 'time' },
  { label: 'log', value: 'log' },
];

interface IXAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  data: TVizData;
}
export function XAxisField({ data, control, watch }: IXAxisField) {
  watch(['x_axis_data_key', 'x_axis_name', 'x_axis']);
  return (
    <Stack>
      <Controller
        name="x_axis_name"
        control={control}
        render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
      />
      <Group grow noWrap>
        <Controller
          name="x_axis_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="x_axis.type"
          control={control}
          render={({ field }) => (
            <Select label="X Axis Data Type" required data={XAxisTypeOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} label="Tick Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="x_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Rotate"
              hideControls
              min={-90}
              max={90}
              rightSection={<Text color="dimmed">degree</Text>}
              sx={{ width: '48%' }}
              styles={{
                rightSection: {
                  width: '4em',
                  justifyContent: 'flex-end',
                  paddingRight: '6px',
                },
              }}
              {...field}
            />
          )}
        />
        <Controller
          name="x_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField data={data} {...field} />}
        />
      </Group>
      <Controller
        name="x_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
    </Stack>
  );
}
