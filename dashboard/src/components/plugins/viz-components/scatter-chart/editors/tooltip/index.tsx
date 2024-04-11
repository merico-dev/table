import { Divider, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { IScatterChartConf } from '../../type';
import { TooltipMetricsField } from './metrics';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface ITooltipField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function TooltipField({ control, watch }: ITooltipField) {
  const { t, i18n } = useTranslation();
  watch('tooltip.trigger');

  const tooltipTriggerOptions = useMemo(
    () => [
      {
        label: t('chart.tooltip.trigger.scatter_point'),
        value: 'item',
      },
      {
        label: t('chart.tooltip.trigger.x_axis'),
        value: 'axis',
      },
    ],
    [i18n.language],
  );
  return (
    <Stack>
      <Controller
        name="tooltip.trigger"
        control={control}
        render={({ field }) => (
          // @ts-expect-error type of onChange
          <Select
            label={t('chart.tooltip.trigger.label')}
            data={tooltipTriggerOptions}
            sx={{ flexGrow: 1 }}
            {...field}
          />
        )}
      />
      <Divider variant="dashed" />
      <TooltipMetricsField control={control} watch={watch} />
    </Stack>
  );
}
