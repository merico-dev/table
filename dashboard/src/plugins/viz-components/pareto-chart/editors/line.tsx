import { Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { IParetoChartConf } from '../type';

const nameAlignmentOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
];

interface ILineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function LineField({ control, watch }: ILineField) {
  watch(['line']);
  return (
    <Stack>
      <Group grow>
        <Controller
          name="line.name"
          control={control}
          render={({ field }) => <TextInput label="Line Name" sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="line.nameAlignment"
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Align" required data={nameAlignmentOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack spacing={2}>
        <Text size="sm">Color</Text>
        <Controller name="line.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
    </Stack>
  );
}
