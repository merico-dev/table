import { ActionIcon, Divider, Group, Select, SelectItem, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { TMericoStatsConf } from '../../type';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  variableOptions: SelectItem[];
}

export function MetricField({ control, index, remove, variableOptions }: IProps) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`metrics.${index}.names.value`}
          control={control}
          render={({ field }) => <TextInput label="Metric Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`metrics.${index}.data_keys.value`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Metric Data" required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`metrics.${index}.names.basis`}
          control={control}
          render={({ field }) => <TextInput label="Basis Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`metrics.${index}.data_keys.basis`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Basis Data" required data={variableOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Format" labelPosition="center" />
        <Controller
          name={`metrics.${index}.formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
        disabled={index === 0}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
}