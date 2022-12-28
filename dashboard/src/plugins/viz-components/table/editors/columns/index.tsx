import { Button, Divider, Group, Stack, Switch, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { AnyObject } from '~/types';
import { ITableConf, ValueType } from '../../type';
import { ColumnField } from './column';

interface IColumnsField {
  form: UseFormReturnType<ITableConf>;
  data: AnyObject[];
}
export const ColumnsField = ({ form, data }: IColumnsField) => {
  const addColumn = () => {
    const id = randomId();
    form.insertListItem('columns', {
      id,
      label: id,
      value_field: 'value',
      value_type: ValueType.string,
    });
  };
  return (
    <>
      <Switch
        mt={20}
        label="Use Original Data Columns"
        {...form.getInputProps('use_raw_columns', { type: 'checkbox' })}
      />
      <Divider mt={20} mb={10} variant="dashed" />
      {!form.values.use_raw_columns && (
        <Stack>
          <Text my={0}>Custom Columns</Text>
          {form.values.columns.map((_item, index) => (
            <ColumnField key={index} form={form} index={index} data={data} />
          ))}
          <Group position="center" mt="xs">
            <Button onClick={addColumn}>Add a Column</Button>
          </Group>
        </Stack>
      )}
    </>
  );
};
