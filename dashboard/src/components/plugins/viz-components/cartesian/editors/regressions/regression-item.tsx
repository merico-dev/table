import { Divider, Group, NumberInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { ICartesianChartConf, IRegressionConf } from '../../type';

interface IRegressionField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  regressionItem: IRegressionConf;
  index: number;

  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function RegressionField({ control, regressionItem, index, yAxisOptions }: IRegressionField) {
  const { t, i18n } = useTranslation();

  const regressionOptions = useMemo(
    () => [
      { label: t('chart.regression_line.method.linear'), value: 'linear' },
      { label: t('chart.regression_line.method.exponential'), value: 'exponential' },
      { label: t('chart.regression_line.method.logistic'), value: 'logistic' },
      { label: t('chart.regression_line.method.polynomial'), value: 'polynomial' },
    ],
    [i18n.language],
  );

  const method = regressionItem.transform.config.method;
  return (
    <Stack my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow>
        <Controller
          name={`regressions.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`regressions.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('chart.series.group_by.label_line')} clearable sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`regressions.${index}.y_axis_data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`regressions.${index}.plot.yAxisIndex`}
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <Select
              label={t('chart.y_axis.label')}
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
          name={`regressions.${index}.transform.config.method`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('chart.regression_line.method.label')}
              data={regressionOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
        {method === 'polynomial' && (
          <Controller
            name={`regressions.${index}.transform.config.order`}
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <NumberInput label={t('chart.regression_line.method.polynomial_order')} sx={{ flex: 1 }} {...field} />
            )}
          />
        )}
      </Group>
      <Divider mb={-15} variant="dashed" label={t('chart.series.line.line_style')} labelPosition="center" />
      <Group grow>
        <Controller
          name={`regressions.${index}.plot.lineStyle.type`}
          control={control}
          render={({ field }) => <LineTypeSelector sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`regressions.${index}.plot.lineStyle.width`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput label={t('chart.series.line.line_width')} min={1} max={10} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <SimpleGrid cols={2}>
        <Controller
          name={`regressions.${index}.plot.color`}
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
    </Stack>
  );
}
