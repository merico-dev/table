import { Divider, Group, NumberInput, Stack, Switch, TextInput } from '@mantine/core';
import { IconTextSize } from '@tabler/icons-react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NumberOrDynamicValue } from '~/components/plugins/common-echarts-fields/number-or-dynamic-value';
import { TMericoHeatmapConf } from '../../type';
import { useTranslation } from 'react-i18next';
import { SeriesUnitField } from '~/components/plugins/common-echarts-fields/series-unit';

interface IHeatBlockField {
  control: Control<TMericoHeatmapConf, $TSFixMe>;
  watch: UseFormWatch<TMericoHeatmapConf>;
}
export function HeatBlockField({ control, watch }: IHeatBlockField) {
  const { t } = useTranslation();
  watch(['heat_block']);
  const showLabel = watch('heat_block.label.show');
  return (
    <Stack>
      <Group grow wrap="nowrap">
        <Controller
          name="heat_block.data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="heat_block.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="heat_block.unit"
        control={control}
        render={({ field }) => <SeriesUnitField hiddenFileds={['show_in_legend']} {...field} />}
      />

      <Divider mb={-15} variant="dashed" label={t('numbro.format.label')} labelPosition="center" />
      <Controller
        name={`heat_block.value_formatter`}
        control={control}
        render={({ field }) => <NumbroFormatSelector {...field} />}
      />

      <Divider mb={-5} variant="dashed" label={t('chart.label.label')} labelPosition="center" />
      <Group grow wrap="nowrap">
        <Controller
          name="heat_block.label.show"
          control={control}
          render={({ field }) => (
            <Switch
              label={t('chart.heatmap.heatblock.show_label')}
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
              sx={{ flexGrow: 1 }}
            />
          )}
        />
        <Controller
          name="heat_block.label.fontSize"
          control={control}
          render={({ field }) => (
            <NumberInput size="xs" leftSection={<IconTextSize size={16} />} disabled={!showLabel} {...field} />
          )}
        />
      </Group>
    </Stack>
  );
}
