import { ActionIcon, Button, Divider, Group, Stack, Switch, Tabs, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { Plus } from 'tabler-icons-react';
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
          <Tabs
            defaultValue={'0'}
            styles={{
              tab: {
                paddingTop: '0px',
                paddingBottom: '0px',
              },
              panel: {
                padding: '0px',
                paddingTop: '6px',
              },
            }}
          >
            <Tabs.List>
              {form.values.columns.map((_item, index) => (
                <Tabs.Tab key={_item.id} value={index.toString()}>
                  {index + 1}
                  {/* {field.name.trim() ? field.name : index + 1} */}
                </Tabs.Tab>
              ))}
              <Tabs.Tab onClick={addColumn} value="add">
                <ActionIcon>
                  <Plus size={18} color="#228be6" />
                </ActionIcon>
              </Tabs.Tab>
            </Tabs.List>
            {form.values.columns.map((_item, index) => (
              <Tabs.Panel key={_item.id} value={index.toString()}>
                <ColumnField key={index} form={form} index={index} data={data} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Stack>
      )}
    </>
  );
};
