import { NumberInput, Stack, Switch } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ITableConf } from '../type';

type Props = {
  control: Control<ITableConf>;
  watch: UseFormWatch<ITableConf>;
};
export function PaginationField({ control, watch }: Props) {
  const { t } = useTranslation();
  watch(['pagination']);
  return (
    <Stack>
      <Controller
        name="pagination.page_size"
        control={control}
        render={({ field }) => (
          <NumberInput
            label={t('common.pagination.page_size')}
            description={t('viz.heatmap.pagination.page_size_hint')}
            size="xs"
            sx={{ flex: 1 }}
            {...field}
            onChange={(v: number | string) => {
              typeof v !== 'string' && field.onChange(v);
            }}
          />
        )}
      />
    </Stack>
  );
}
