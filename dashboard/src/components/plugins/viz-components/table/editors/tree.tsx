import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { ITableConf } from '../type';

type Props = {
  control: Control<ITableConf>;
  watch: UseFormWatch<ITableConf>;
};

export function TreeField({ control, watch }: Props) {
  const { t } = useTranslation();
  watch(['sub_rows_column_key']);
  return (
    <Stack>
      <Controller
        name="sub_rows_column_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector
            label={t('viz.table.tree.sub_rows_key')}
            description={t('viz.table.tree.sub_rows_key_hint')}
            placeholder="children"
            size="xs"
            sx={{ flex: 1 }}
            clearable
            {...field}
            value={field.value ?? ''}
          />
        )}
      />
    </Stack>
  );
}
