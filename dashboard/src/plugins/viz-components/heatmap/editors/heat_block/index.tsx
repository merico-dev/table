import { Box, Checkbox, Divider, Group, NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IHeatmapConf } from '../../type';
import { IconTextSize } from '@tabler/icons-react';

interface IHeatBlockField {
  control: Control<IHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<IHeatmapConf>;
}
export function HeatBlockField({ control, watch }: IHeatBlockField) {
  watch(['heat_block']);
  const showLabel = watch('heat_block.label.show');
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
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput label="Min Value" {...field} />}
        />
        <Controller
          name="heat_block.max"
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput label="Max Value" {...field} />}
        />
      </Group>

      <Divider mb={-15} variant="dashed" label="Value Format" labelPosition="center" />
      <Controller
        name={`heat_block.value_formatter`}
        control={control}
        render={({ field }) => <NumbroFormatSelector {...field} />}
      />

      <Divider mb={-5} variant="dashed" label="Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name="heat_block.label.show"
          control={control}
          render={({ field }) => (
            <Switch
              label="Show label"
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              sx={{ flexGrow: 1 }}
            />
          )}
        />
        <Controller
          name="heat_block.label.fontSize"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput size="xs" icon={<IconTextSize size={16} />} disabled={!showLabel} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
