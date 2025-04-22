import { Checkbox, Divider, Group, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AggregationSelector } from '~/components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import {
  IEchartsLabelPosition,
  LabelPositionSelector,
} from '~/components/plugins/common-echarts-fields/label-position';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { DefaultAggregation } from '~/utils';
import { IHorizontalBarChartConf, IHorizontalBarChartSeriesItem } from '../../type';
import { BarFields } from './fields.bar';
import { SeriesUnitField } from '~/components/plugins/common-echarts-fields/series-unit';

interface ISeriesItemField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  seriesItem: IHorizontalBarChartSeriesItem;
  xAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function SeriesItemField({ control, index, seriesItem, xAxisOptions }: ISeriesItemField) {
  const { t } = useTranslation();
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow wrap="nowrap">
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.xAxisIndex`}
          control={control}
          render={({ field }) => (
            <Select
              label={t('chart.x_axis.label')}
              data={xAxisOptions}
              disabled={xAxisOptions.length === 0}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <SimpleGrid cols={2}>
        <Controller
          name={`series.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.aggregation_on_value`}
          control={control}
          render={({ field }) => (
            <AggregationSelector
              label={t('viz.horizontal_bar_chart.series.aggregation.label')}
              value={field.value ?? DefaultAggregation}
              onChange={field.onChange}
              pt={0}
              withFallback={false}
            />
          )}
        />
      </SimpleGrid>
      <Group grow>
        <Controller
          name={`series.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.series.group_by.label')} clearable sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Controller
        name={`series.${index}.unit`}
        control={control}
        render={({ field }) => <SeriesUnitField {...field} />}
      />
      <BarFields index={index} control={control} seriesItem={seriesItem} />
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.style.label')} labelPosition="center" />
      <Controller
        name={`series.${index}.label_position`}
        control={control}
        render={({ field }) => (
          <LabelPositionSelector
            label={t('chart.label_position.label')}
            {...field}
            withOffOption
            onChange={(v?: IEchartsLabelPosition) => {
              field.onChange(v ?? '');
            }}
          />
        )}
      />
      <SimpleGrid cols={2}>
        <Controller
          name={`series.${index}.color`}
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.behavior.label')} labelPosition="center" />
      <Controller
        name={`series.${index}.hide_in_legend`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.legend.hide_in_legend')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
      <Controller
        name={`series.${index}.invisible`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.behavior.invisible')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
