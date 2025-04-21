import { Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IBoxplotChartConf } from '../../type';
import { SeriesUnitField } from '~/components/plugins/common-echarts-fields/series-unit';

interface ITooltipMetricField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  index: number;
}

export const TooltipMetricField = ({ control, index }: ITooltipMetricField) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Group grow wrap="nowrap">
        <Controller
          name={`tooltip.metrics.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`tooltip.metrics.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Controller
        name={`tooltip.metrics.${index}.unit`}
        control={control}
        render={({ field }) => <SeriesUnitField hiddenFileds={['show_in_legend']} {...field} />}
      />
    </Stack>
  );
};
