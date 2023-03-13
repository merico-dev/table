import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { ICalendarHeatmapConf } from '../../type';

interface ICalendarField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
  data: $TSFixMe[];
}
export function CalendarField({ data, control, watch }: ICalendarField) {
  watch(['calendar']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="calendar.data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Data Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
