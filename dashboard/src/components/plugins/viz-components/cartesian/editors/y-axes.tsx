import { ActionIcon, Button, Checkbox, Divider, Group, Select, Stack, Tabs, TextInput } from '@mantine/core';
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Plus, Trash } from 'tabler-icons-react';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { ICartesianChartConf } from '../type';
import { defaultNumberFormat } from '~/utils';

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
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
}

function YAxisField({ control, index, remove }: IYAxisField) {
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
            <Select label="Name Anchor" required data={nameAlignmentOptions} sx={{ flex: 1 }} {...field} />
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

      <Divider mb={-10} mt={10} variant="dashed" label="Behavior" labelPosition="center" />
      <Controller
        name={`y_axes.${index}.show`}
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
        Delete this YAxis
      </Button>
    </Stack>
  );
}

interface IYAxesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'y_axes',
  });

  const watchFieldArray = watch('y_axes');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addYAxis = () =>
    append({
      name: '',
      position: 'left',
      nameAlignment: 'left',
      label_formatter: defaultNumberFormat,
      min: '',
      max: '',
      show: true,
    });

  return (
    <Tabs
      defaultValue="0"
      styles={{
        tab: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        panel: {
          padding: '0px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={field.id} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addYAxis} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={index.toString()}>
          <YAxisField control={control} index={index} remove={remove} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
