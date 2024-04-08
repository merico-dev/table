import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IParetoChartConf } from '../type';
import { useTranslation } from 'react-i18next';

interface IYAxisField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function YAxisField({ control, watch }: IYAxisField) {
  const { t } = useTranslation();
  watch(['data_key']);
  return (
    <Stack>
      <Controller
        name="data_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label={t('chart.y_axis.y_axis_data_field')} required sx={{ flex: 1 }} {...field} />
        )}
      />
    </Stack>
  );
}
