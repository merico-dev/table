import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IScatterChartConf } from '../../type';
import { XAxisLabelFormatterField } from './x-axis-label-formatter';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';

interface IXAxisField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Data Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="x_axis.name"
          control={control}
          render={({ field }) => <TextInput label="Name" sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} label="Tick Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="x_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
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
          render={({ field }) => <XAxisLabelFormatterField {...field} />}
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
