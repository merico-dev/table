import { Divider, Stack, Switch, Tabs, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { Control, Controller, UseFormWatch, useFieldArray } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { IColumnConf, ITableConf, ValueType } from '../../type';
import { ColumnField } from './column';

interface IColumnsField {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
}
export const ColumnsField = ({ control, watch }: IColumnsField) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'columns',
  });

  const addColumn = () => {
    const id = randomId();
    append({
      id,
      label: id,
      align: 'center',
      value_field: '',
      value_type: ValueType.string,
      width: '',
    } as IColumnConf);
  };

  watch('columns');
  const use_raw_columns = watch('use_raw_columns');
  return (
    <>
      <Controller
        name="use_raw_columns"
        control={control}
        render={({ field }) => (
          <Switch
            mt={20}
            mb={20}
            label="Use Original Data Columns"
            checked={field.value}
            onChange={(e) => field.onChange(e.currentTarget.checked)}
          />
        )}
      />
      {!use_raw_columns && (
        <Stack>
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
              {fields.map((_item, index) => (
                <Tabs.Tab key={_item.id} value={index.toString()}>
                  {index + 1}
                  {/* {field.name.trim() ? field.name : index + 1} */}
                </Tabs.Tab>
              ))}
              <Tabs.Tab onClick={addColumn} value="add">
                <Plus size={18} color="#228be6" />
              </Tabs.Tab>
            </Tabs.List>
            {fields.map((column, index) => (
              <Tabs.Panel key={column.id} value={index.toString()}>
                <ColumnField control={control} watch={watch} index={index} column={column} remove={remove} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Stack>
      )}
    </>
  );
};
