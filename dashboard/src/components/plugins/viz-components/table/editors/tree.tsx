import { Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
          <TextInput
            label={t('viz.table.tree.sub_rows_key')}
            description={t('viz.table.tree.sub_rows_key_hint')}
            placeholder="children"
            size="xs"
            sx={{ flex: 1 }}
            {...field}
            value={field.value ?? ''}
          />
        )}
      />
    </Stack>
  );
}
