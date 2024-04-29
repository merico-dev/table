import { Button, Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { ICalendarHeatmapConf } from '../../type';
import { useTranslation } from 'react-i18next';

interface ITooltipMetricField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  index: number;
}

export const TooltipMetricField = ({ control, index }: ITooltipMetricField) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`tooltip.metrics.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`tooltip.metrics.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
};
