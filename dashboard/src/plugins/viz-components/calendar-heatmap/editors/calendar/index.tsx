import { Group, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { ICalendarHeatmapConf } from '../../type';

const localeOptions = [
  {
    label: 'Chinese',
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
  watch(['calendar']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="calendar.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Data Field" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="calendar.locale"
        control={control}
        render={({ field }) => <Select label="Language" required data={localeOptions} sx={{ flex: 1 }} {...field} />}
      />
    </Stack>
  );
}
