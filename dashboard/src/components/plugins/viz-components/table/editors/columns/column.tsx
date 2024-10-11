import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { HorizontalAlignSelector } from '~/components/plugins/editor-components';
import { BackgroundColorSelect } from '../../components/background-color-select';
import { DEFAULT_CELL_FUNC_CONTENT, ITableConf, ValueType } from '../../type';
import { ValueTypeSelector } from '../../value-type-selector';
import { FuncContentEditor } from './func_content-editor';

const PostFixPX = () => (
  <Text c="dimmed" size={12}>
    px
  </Text>
);

interface IColumnField {
  control: Control<ITableConf, $TSFixMe>;
  watch: UseFormWatch<ITableConf>;
  index: number;
}
export const ColumnField = ({ control, index, watch }: IColumnField) => {
  const { t } = useTranslation();
  const value_type = watch(`columns.${index}.value_type`);
  const queryID = watch('query_id');

  return (
    <Stack my={0} sx={{ position: 'relative' }}>
      <Group grow>
        <Controller
          name={`columns.${index}.label`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('chart.label.label')} required id={`col-label-${index}`} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`columns.${index}.value_field`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required queryID={queryID} {...field} />
          )}
        />
      </Group>
      <Group grow>
        <Controller
          name={`columns.${index}.value_type`}
          control={control}
          render={({ field }) => <ValueTypeSelector sx={{ flex: 1 }} {...field} />}
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
      <Divider mb={-10} variant="dashed" label={t('style.label')} labelPosition="center" />
      <Group grow>
        <NumberInput hideControls label={t('viz.table.column.min_width')} rightSection={<PostFixPX />} disabled />
        <Controller
          name={`columns.${index}.width`}
          control={control}
          render={({ field }) => (
            <NumberInput hideControls label={t('viz.table.column.width')} rightSection={<PostFixPX />} {...field} />
          )}
        />
        <NumberInput hideControls label={t('viz.table.column.max_width')} rightSection={<PostFixPX />} disabled />
      </Group>
      <Group grow wrap="nowrap">
        <Controller
          name={`columns.${index}.align`}
          control={control}
          render={({ field }) => <HorizontalAlignSelector {...field} />}
        />
      </Group>
      <Controller
        name={`columns.${index}.cellBackgroundColor`}
        control={control}
        render={({ field }) => <BackgroundColorSelect {...field} />}
      />
    </Stack>
  );
};
