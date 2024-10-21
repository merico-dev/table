import { NumberInput, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IHeatmapConf } from '../../type';

type Props = {
  control: Control<IHeatmapConf>;
  watch: UseFormWatch<IHeatmapConf>;
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
