import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { ICalendarHeatmapConf } from '../../type';

interface IHeatBlockField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
}
export function HeatBlockField({ control, watch }: IHeatBlockField) {
  watch(['heat_block']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="heat_block.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Data Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="heat_block.name"
          control={control}
          render={({ field }) => <TextInput label="Name" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name="heat_block.min"
          control={control}
          render={({ field }) => <NumberOrDynamicValue label="Min Value" {...field} />}
        />
        <Controller
          name="heat_block.max"
          control={control}
          render={({ field }) => <NumberOrDynamicValue label="Max Value" {...field} />}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label="Value Format" labelPosition="center" />
      <Controller
        name={`heat_block.value_formatter`}
        control={control}
        render={({ field }) => <NumbroFormatSelector {...field} />}
      />
    </Stack>
  );
}
