import { Group, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { ICalendarHeatmapConf } from '../../type';
import { useTranslation } from 'react-i18next';

const localeOptions = [
  {
    label: '中文',
    value: 'ZH',
  },
  {
    label: 'English',
    value: 'EN',
  },
];

interface ICalendarField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
}
export function CalendarField({ control, watch }: ICalendarField) {
  const { t } = useTranslation();
  watch(['calendar']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="calendar.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label={t('common.data_field')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="calendar.locale"
        control={control}
        render={({ field }) => (
          // @ts-expect-error type of onChange
          <Select label={t('viz.calendar_heatmap.calendar.locale')} data={localeOptions} sx={{ flex: 1 }} {...field} />
        )}
      />
    </Stack>
  );
}
