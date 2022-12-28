import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import _ from 'lodash';
import { useEffect } from 'react';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { AnyObject } from '~/types';
import { BackgroundColorSelect } from '../../components/background-color-select';
import { DEFAULT_CELL_FUNC_CONTENT, ITableConf, ValueType } from '../../type';
import { ValueTypeSelector } from '../../value-type-selector';
import { FuncContentEditor } from './func_content-editor';

interface IColumnField {
  form: UseFormReturnType<ITableConf>;
  index: number;
  data: AnyObject[];
}
export const ColumnField = ({ form, index, data }: IColumnField) => {
  const value_type = _.get(form.values, `columns.${index}.value_type`);
  useEffect(() => {
    if (value_type === ValueType.custom) {
      const handleChange = form.getInputProps(`columns.${index}.func_content`).onChange;
      handleChange(DEFAULT_CELL_FUNC_CONTENT);
    }
  }, [value_type, form]);

  return (
    <Stack my={0} sx={{ position: 'relative' }}>
      <Group grow>
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
      </Group>
      <Group grow>
        <ValueTypeSelector label="Value Type" sx={{ flex: 1 }} {...form.getInputProps(`columns.${index}.value_type`)} />
        {value_type === ValueType.custom && (
          <FuncContentEditor {...form.getInputProps(`columns.${index}.func_content`)} />
        )}
      </Group>
      <BackgroundColorSelect {...form.getInputProps(`columns.${index}.cellBackgroundColor`)} />

      <Divider mb={4} mt={12} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => form.removeListItem('columns', index)}
      >
        Delete this column
      </Button>
    </Stack>
  );
};
