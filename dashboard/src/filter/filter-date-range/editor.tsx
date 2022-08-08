import { Checkbox, Divider, Group, Select } from '@mantine/core';
import { Control, Controller, FieldArrayWithId } from 'react-hook-form';
import { IFilterSettingsForm } from '../filter-settings/types';

interface IFilterEditorDateRange {
  field: FieldArrayWithId<IFilterSettingsForm, 'filters', 'id'>;
  index: number;
  control: Control<IFilterSettingsForm, object>;
}

const inputFormatOptions = [
  { label: '2022', value: 'YYYY' },
  { label: '2022-01', value: 'YYYY-MM' },
  { label: '2022-01-01', value: 'YYYY-MM-DD' },
];

export function FilterEditorDateRange({ field, index, control }: IFilterEditorDateRange) {
  return (
    <>
      <Group>
        <Controller
          name={`filters.${index}.config.required`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              label="Required"
            />
          )}
        />
        <Controller
          name={`filters.${index}.config.clearable`}
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              label="Clearable"
            />
          )}
        />
      </Group>
      <Controller
        name={`filters.${index}.config.inputFormat`}
        control={control}
        render={({ field }) => <Select data={inputFormatOptions} label="Display Format" {...field} />}
      />
    </>
  );
}
