import {
  ActionIcon,
  Anchor,
  Divider,
  Group,
  HoverCard,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { ICartesianChartConf } from '../../type';
import { XAxisLabelFormatterField } from './x-axis-label-formatter';
import { IconInfoCircle } from '@tabler/icons';

//https://echarts.apache.org/zh/option.html#xAxis.type
const XAxisTypeLabel = () => {
  return (
    <Group sx={{ display: 'inline-flex' }} spacing={6} mr={14}>
      <Text>X Axis Data Type</Text>
      <HoverCard width={340} shadow="md" position="top">
        <HoverCard.Target>
          <ActionIcon size="xs" sx={{ transform: 'none !important' }}>
            <IconInfoCircle />
          </ActionIcon>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            Click
            <Anchor href="https://echarts.apache.org/en/option.html#xAxis.type" target="_blank" mx={4}>
              here
            </Anchor>
            to learn more about these options
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};

const XAxisTypeOptions = [
  { label: 'Value', value: 'value' },
  { label: 'Category', value: 'category' },
  { label: 'Time', value: 'time' },
  { label: 'Log', value: 'log' },
];

interface IXAxisField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function XAxisField({ control, watch }: IXAxisField) {
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
          render={({ field }) => <DataFieldSelector label="X Axis Data Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="x_axis.type"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={<XAxisTypeLabel />} required data={XAxisTypeOptions} sx={{ flex: 1 }} {...field} />
          )}
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
