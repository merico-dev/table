import { Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { AnyObject } from '~/types';
import { IHeatmapConf } from '../../type';

const nameAlignmentOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
];
const positionOptions = [
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
];

interface IYAxisField {
  watch: UseFormWatch<IHeatmapConf>;
  control: Control<IHeatmapConf, $TSFixMe>;
  data: AnyObject[];
}

export function YAxisField({ control, watch, data }: IYAxisField) {
  watch(['y_axis']);
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Controller
        name="y_axis.data_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label="Data Field" required data={data} sx={{ flex: 1 }} {...field} />
        )}
      />
      <Divider mb={-15} variant="dashed" label="Name" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="y_axis.name"
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="y_axis.nameAlignment"
          control={control}
          render={({ field }) => (
            <Select label="Align" required data={nameAlignmentOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label="Layout" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="y_axis.position"
          control={control}
          render={({ field }) => (
            <Select label="Position" required data={positionOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
        <Controller
          name="y_axis.label_formatter"
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>

      <Stack>
        <Divider mb={-15} variant="dashed" label="Value Range" labelPosition="center" />
        <Group grow>
          <Controller
            name="y_axis.min"
            control={control}
            render={({ field }) => <TextInput label="Min" {...field} />}
          />
          <Controller
            name="y_axis.max"
            control={control}
            render={({ field }) => <TextInput label="Max" {...field} />}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
