import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IRegressionChartConf } from '../type';
import { XAxisLabelFormatterField } from '~/plugins/common-echarts-fields/x-axis-label-formatter';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';

interface IXAxisField {
  control: Control<IRegressionChartConf, $TSFixMe>;
  watch: UseFormWatch<IRegressionChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
  watch(['x_axis']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="x_axis.name"
          control={control}
          render={({ field }) => <TextInput label="X轴名称" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="x_axis.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="X轴数据字段" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider variant="dashed" labelPosition="center" label="格式化数据" />
      <Stack>
        <Controller
          name="x_axis.axisLabel.format"
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
      <Divider variant="dashed" labelPosition="center" label="标签文案样式" />
      <Group grow noWrap>
        <Controller
          name="x_axis.axisLabel.rotate"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput
              label="旋转"
              hideControls
              min={-90}
              max={90}
              rightSection={<Text color="dimmed">度</Text>}
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
          render={({ field }) => <XAxisLabelFormatterField triggerButtonText="自定义标签文案内容" {...field} />}
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
