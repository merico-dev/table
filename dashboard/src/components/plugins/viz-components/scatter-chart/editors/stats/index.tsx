import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { TemplateInput } from '~/utils';
import { IScatterChartConf } from '../../type';
import { useTranslation } from 'react-i18next';

interface IVariablesField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}

export function StatsField({ control, watch }: IVariablesField) {
  const { t } = useTranslation();
  watch('stats');
  return (
    <Stack>
      <Stack spacing={0}>
        <Controller
          name="stats.templates.top"
          control={control}
          render={({ field }) => (
            <TemplateInput label={t('chart.stats.template.above_chart')} py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name="stats.templates.bottom"
          control={control}
          render={({ field }) => (
            <TemplateInput label={t('chart.stats.template.under_chart')} py="md" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Stack>
    </Stack>
  );
}
