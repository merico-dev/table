import { Switch, Textarea } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { IColumnConf, ITableConf, ValueType } from '../../type';
import { ColumnField } from './column';

interface IColumnsField {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
}
export const ColumnsField = ({ control, watch }: IColumnsField) => {
  const { t } = useTranslation();

  const getItem = () => {
    const id = randomId();
    return {
      id,
      label: id,
      align: 'center',
      value_field: '',
      value_type: ValueType.string,
      width: '',
    } as IColumnConf;
  };

  const renderTabName = (field: IColumnConf, index: number) => {
    const n = field.label.trim();
    return n ? n : index + 1;
  };

  watch(['columns', 'ignored_column_keys']);
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
            label={t('viz.table.column.use_original_data_columns')}
            checked={field.value}
            onChange={(e) => field.onChange(e.currentTarget.checked)}
          />
        )}
      />
      {use_raw_columns && (
        <Controller
          name="ignored_column_keys"
          control={control}
          render={({ field }) => (
            <Textarea
              label={t('viz.table.column.ignore_columns_by_these_key')}
              placeholder={t('viz.table.column.separate_by_line_break')}
              autosize
              minRows={2}
              maxRows={10}
              {...field}
            />
          )}
        />
      )}
      {!use_raw_columns && (
        <FieldArrayTabs<ITableConf, IColumnConf>
          control={control}
          watch={watch}
          name="columns"
          getItem={getItem}
          addButtonText={t('viz.table.column.add')}
          deleteButtonText={t('viz.table.column.delete')}
          renderTabName={renderTabName}
        >
          {({ field, index }) => <ColumnField control={control} watch={watch} index={index} />}
        </FieldArrayTabs>
      )}
    </>
  );
};
