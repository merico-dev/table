import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { AnyObject } from '~/types';
import { BackgroundColorSelect } from '../../components/background-color-select';
import { DEFAULT_CELL_FUNC_CONTENT, IColumnConf, ITableConf, ValueType } from '../../type';
import { ValueTypeSelector } from '../../value-type-selector';
import { FuncContentEditor } from './func_content-editor';

interface IColumnField {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
  index: number;
  remove: UseFieldArrayRemove;
  column: IColumnConf;
  data: AnyObject[];
}
export const ColumnField = ({ control, index, watch, remove, column, data }: IColumnField) => {
  const value_type = watch(`columns.${index}.value_type`);

  return (
    <Stack my={0} sx={{ position: 'relative' }}>
      <Group grow>
        <Controller
          name={`columns.${index}.label`}
          control={control}
          render={({ field }) => (
            <TextInput label="Label" required id={`col-label-${index}`} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`columns.${index}.value_field`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Field" required data={data} {...field} />}
        />
      </Group>
      <Group grow>
        <Controller
          name={`columns.${index}.value_type`}
          control={control}
          render={({ field }) => <ValueTypeSelector label="Value Type" sx={{ flex: 1 }} {...field} />}
        />
        {value_type === ValueType.custom && (
          <Controller
            name={`columns.${index}.func_content`}
            control={control}
            render={({ field }) => (
              <FuncContentEditor
                value={field.value ?? DEFAULT_CELL_FUNC_CONTENT}
                onChange={(v?: string) => field.onChange(v ?? '')}
              />
            )}
          />
        )}
      </Group>
      <Controller
        name={`columns.${index}.cellBackgroundColor`}
        control={control}
        render={({ field }) => <BackgroundColorSelect {...field} />}
      />

      <Divider mb={4} mt={12} variant="dashed" />
      <Button leftIcon={<Trash size={16} />} color="red" variant="light" onClick={() => remove(index)}>
        Delete this column
      </Button>
    </Stack>
  );
};
