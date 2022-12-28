import { ActionIcon, Group, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { AnyObject } from '~/types';
import { BackgroundColorSelect } from '../../components/background-color-select';
import { ITableConf } from '../../type';
import { ValueTypeSelector } from '../../value-type-selector';

interface IColumnField {
  form: UseFormReturnType<ITableConf>;
  index: number;
  data: AnyObject[];
}
export const ColumnField = ({ form, index, data }: IColumnField) => {
  return (
    <Stack my={0} pr={40} sx={{ position: 'relative' }}>
      <Group position="apart" grow>
        <TextInput
          label="Label"
          required
          id={`col-label-${index}`}
          sx={{ flex: 1 }}
          {...form.getInputProps(`columns.${index}.label`)}
        />
        <DataFieldSelector
          label="Value Field"
          required
          data={data}
          {...form.getInputProps(`columns.${index}.value_field`)}
        />
        <ValueTypeSelector label="Value Type" sx={{ flex: 1 }} {...form.getInputProps(`columns.${index}.value_type`)} />
        <BackgroundColorSelect {...form.getInputProps(`columns.${index}.cellBackgroundColor`)} />
      </Group>
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => form.removeListItem('columns', index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
};
