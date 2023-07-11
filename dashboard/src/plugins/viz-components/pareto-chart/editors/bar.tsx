import { Divider, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IParetoChartConf } from '../type';

const nameAlignmentOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
];

interface IBarField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function BarField({ control, watch }: IBarField) {
  watch(['bar']);
  return (
    <Stack>
      <Group grow>
        <Controller
          name="bar.name"
          control={control}
          render={({ field }) => <TextInput label="Bar Name" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="bar.nameAlignment"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Align" required data={nameAlignmentOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller name="bar.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
        <Controller
          name="bar.label_formatter"
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}
