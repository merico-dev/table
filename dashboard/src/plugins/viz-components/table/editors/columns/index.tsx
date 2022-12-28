import { ActionIcon, Button, Group, Stack, Switch, Text, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { AnyObject } from '~/types';
import { BackgroundColorSelect } from '../../components/background-color-select';
import { ITableConf, ValueType } from '../../type';
import { ValueTypeSelector } from '../../value-type-selector';
interface IColumnsField {
  form: UseFormReturnType<ITableConf>;
  data: AnyObject[];
}
export const ColumnsField = ({ form, data }: IColumnsField) => {
  const addColumn = () =>
    form.insertListItem('columns', {
      label: randomId(),
      value_field: 'value',
      value_type: ValueType.string,
    });
  return (
    <>
      <Switch label="Use Original Data Columns" {...form.getInputProps('use_raw_columns', { type: 'checkbox' })} />
      {!form.values.use_raw_columns && (
        <Stack>
          <Text mt="xl" mb={0}>
            Custom Columns
          </Text>
          {form.values.columns.map((_item, index) => (
            <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
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
                <ValueTypeSelector
                  label="Value Type"
                  sx={{ flex: 1 }}
                  {...form.getInputProps(`columns.${index}.value_type`)}
                />
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
          ))}
          <Group position="center" mt="xs">
            <Button onClick={addColumn}>Add a Column</Button>
          </Group>
        </Stack>
      )}
    </>
  );
};
