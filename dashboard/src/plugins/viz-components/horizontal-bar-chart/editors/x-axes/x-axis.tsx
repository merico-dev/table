import { Button, Checkbox, Divider, Group, Select, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IHorizontalBarChartConf } from '../../type';

const positionOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

interface IXAxisField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
}

export function XAxisField({ control, index, remove }: IXAxisField) {
  return (
    <Stack my={0} p="0" sx={{ position: 'relative' }}>
      <Divider mb={-15} mt={15} variant="dashed" label="Name" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`x_axes.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label="Layout" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`x_axes.${index}.position`}
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
          name={`x_axes.${index}.label_formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>

      <Stack>
        <Divider mb={-15} variant="dashed" label="Value Range" labelPosition="center" />
        <Group grow>
          <Controller
            name={`x_axes.${index}.min`}
            control={control}
            render={({ field }) => <TextInput label="Min" {...field} />}
          />
          <Controller
            name={`x_axes.${index}.max`}
            control={control}
            render={({ field }) => <TextInput label="Max" {...field} />}
          />
        </Group>
      </Stack>
      <Divider mb={-10} mt={10} variant="dashed" label="Behavior" labelPosition="center" />
      <Controller
        name={`x_axes.${index}.show`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Visible"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />

      <Button
        mt={20}
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        disabled={index === 0}
      >
        Delete this X Axis
      </Button>
    </Stack>
  );
}
