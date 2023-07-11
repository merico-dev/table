import { Button, Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IScatterChartConf } from '../../type';

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
  control: Control<IScatterChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
}

export function YAxisField({ control, index, remove }: IYAxisField) {
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Divider mb={-15} mt={15} variant="dashed" label="Name" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`y_axes.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`y_axes.${index}.nameAlignment`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Align" required data={nameAlignmentOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label="Layout" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`y_axes.${index}.position`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Position" required data={positionOptions} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Label Format" labelPosition="center" />
        <Controller
          name={`y_axes.${index}.label_formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>

      <Stack>
        <Divider mb={-15} variant="dashed" label="Value Range" labelPosition="center" />
        <Group grow>
          <Controller
            name={`y_axes.${index}.min`}
            control={control}
            render={({ field }) => <TextInput label="Min" {...field} />}
          />
          <Controller
            name={`y_axes.${index}.max`}
            control={control}
            render={({ field }) => <TextInput label="Max" {...field} />}
          />
        </Group>
      </Stack>

      <Button
        mt={20}
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        disabled={index === 0}
      >
        Delete this YAxis
      </Button>
    </Stack>
  );
}
