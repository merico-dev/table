import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { XAxisLabelFormatterField } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import { IMericoEstimationChartConf } from '../type';
import { AxisLabelRotateInput } from '~/components/plugins/common-echarts-fields/axis-label-rotate';

interface IXAxisField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  watch: UseFormWatch<IMericoEstimationChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="数据字段" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="x_axis.name"
          control={control}
          render={({ field }) => <TextInput label="X轴名称" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} label="点位文案" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="x_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => <AxisLabelRotateInput sx={{ width: '48%' }} {...field} />}
        />
        <Controller
          name="x_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
        />
      </Group>
    </Stack>
  );
}
