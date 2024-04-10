import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { ICalendarHeatmapConf } from '../../type';
import { useTranslation } from 'react-i18next';

interface IHeatBlockField {
  control: Control<ICalendarHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<ICalendarHeatmapConf>;
}
export function HeatBlockField({ control, watch }: IHeatBlockField) {
  const { t } = useTranslation();
  watch(['heat_block']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="heat_block.data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label={t('common.data_field')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="heat_block.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name="heat_block.min"
          control={control}
          render={({ field }) => (
            <NumberOrDynamicValue label={t('viz.calendar_heatmap.heatblock.min_value')} {...field} />
          )}
        />
        <Controller
          name="heat_block.max"
          control={control}
          render={({ field }) => (
            <NumberOrDynamicValue label={t('viz.calendar_heatmap.heatblock.max_value')} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label={t('numbro.format.label')} labelPosition="center" />
      <Controller
        name={`heat_block.value_formatter`}
        control={control}
        render={({ field }) => <NumbroFormatSelector {...field} />}
      />
    </Stack>
  );
}
