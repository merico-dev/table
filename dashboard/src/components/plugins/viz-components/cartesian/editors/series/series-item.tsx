import { Button, Checkbox, Divider, Group, SegmentedControl, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { AggregationSelector } from '~/components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { DefaultAggregation } from '~/utils';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { BarFields } from './fields.bar';
import { LineFields } from './fields.line';
import { ScatterFields } from './fields.scatter';
import { LabelPositionSelector } from '~/components/plugins/common-echarts-fields/label-position';
import { useTranslation } from 'react-i18next';

interface ISeriesItemField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  seriesItem: ICartesianChartSeriesItem;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function SeriesItemField({ control, index, remove, seriesItem, yAxisOptions }: ISeriesItemField) {
  const { t } = useTranslation();
  const type = seriesItem.type;
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Stack>
        <Controller
          name={`series.${index}.type`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <SegmentedControl
              data={[
                { label: t('chart.series.line.label'), value: 'line' },
                { label: t('chart.series.bar.label'), value: 'bar' },
                { label: t('chart.series.scatter.label'), value: 'scatter' },
              ]}
              {...field}
            />
          )}
        />
      </Stack>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('chart.series.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.yAxisIndex`}
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <Select
              label={t('chart.series.y_axis')}
              data={yAxisOptions}
              disabled={yAxisOptions.length === 0}
              {...rest}
              value={value?.toString() ?? ''}
              onChange={(value: string | null) => {
                if (!value) {
                  onChange(0);
                  return;
                }
                onChange(Number(value));
              }}
              sx={{ flex: 1 }}
            />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.y_axis_data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.series.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.aggregation_on_value`}
          control={control}
          render={({ field }) => (
            <AggregationSelector
              label={t('viz.cartesian_chart.series.aggregation.label')}
              value={field.value ?? DefaultAggregation}
              onChange={field.onChange}
              pt={0}
              withFallback={false}
            />
          )}
        />
      </Group>
      <Group grow>
        <Controller
          name={`series.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.series.group_by.label')} clearable sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      {type === 'line' && <LineFields index={index} control={control} seriesItem={seriesItem} />}
      {type === 'bar' && <BarFields index={index} control={control} seriesItem={seriesItem} />}
      {type === 'scatter' && <ScatterFields index={index} control={control} />}
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.style.label')} labelPosition="center" />
      <Controller
        name={`series.${index}.label_position`}
        control={control}
        render={({ field }) => (
          <LabelPositionSelector label={t('chart.label_position.label')} withOffOption {...field} />
        )}
      />
      <Stack spacing={4}>
        <Text size="sm">{t('chart.color.label')}</Text>
        <Controller
          name={`series.${index}.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.behavior.label')} labelPosition="center" />
      <Controller
        name={`series.${index}.hide_in_legend`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={t('chart.series.hide_in_legend')}
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
      <Divider mb={-10} mt={10} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        {t('chart.series.delete')}
      </Button>
    </Stack>
  );
}
