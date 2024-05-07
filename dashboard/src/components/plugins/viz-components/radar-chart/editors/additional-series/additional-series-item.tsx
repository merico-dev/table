import { Group, Stack } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { IRadarChartConf } from '../../type';

type Props = {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
};

export function AdditionalSeriesItemField({ control, index }: Props) {
  const { t } = useTranslation();
  return (
    <Stack my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`additional_series.${index}.name_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector
              label={t('viz.radar_chart.series.series_name_field')}
              required
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Stack>
        <Controller
          name={`additional_series.${index}.color_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector
              label={t('viz.radar_chart.style.color_field')}
              required
              clearable
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}
