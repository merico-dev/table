import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { XAxisLabelFormatterField } from '~/components/plugins/viz-components/cartesian/editors/x-axis/x-axis-label-formatter';
import { IHorizontalBarChartConf } from '../../type';

interface IYAxisField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
}
export function YAxisField({ control, watch }: IYAxisField) {
  watch(['y_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="y_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Y Axis Data Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} label="Tick Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="y_axis.axisLabel.formatter"
          control={control}
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
        />
      </Group>
      <Controller
        name="y_axis.axisLabel.overflow"
        control={control}
        render={({ field }) => <LabelOverflowField {...field} />}
      />
    </Stack>
  );
}
