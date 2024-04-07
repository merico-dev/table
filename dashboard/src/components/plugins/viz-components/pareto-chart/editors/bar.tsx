import { Divider, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { IParetoChartConf } from '../type';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';

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
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
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
