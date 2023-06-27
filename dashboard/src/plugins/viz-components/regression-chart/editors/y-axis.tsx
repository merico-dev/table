import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IRegressionChartConf } from '../type';
import { XAxisLabelFormatterField } from '~/plugins/common-echarts-fields/x-axis-label-formatter';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';

interface IYAxisField {
  control: Control<IRegressionChartConf, $TSFixMe>;
  watch: UseFormWatch<IRegressionChartConf>;
  data: TVizData;
}
export function YAxisField({ data, control, watch }: IYAxisField) {
  watch(['y_axis', 'regression.y_axis_data_key']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label="Y轴名称" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="regression.y_axis_data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Y轴数据字段" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
    </Stack>
  );
}
