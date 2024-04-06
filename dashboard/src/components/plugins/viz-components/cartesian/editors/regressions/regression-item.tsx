import { Button, Divider, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { ICartesianChartConf, IRegressionConf } from '../../type';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface IRegressionField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  regressionItem: IRegressionConf;
  index: number;
  remove: UseFieldArrayRemove;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function RegressionField({ control, regressionItem, index, remove, yAxisOptions }: IRegressionField) {
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

  const lineTypeOptions = useMemo(
    () => [
      { label: t('chart.series.line.type.solid'), value: 'solid' },
      { label: t('chart.series.line.type.dashed'), value: 'dashed' },
      { label: t('chart.series.line.type.dotted'), value: 'dotted' },
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
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label={t('chart.series.line.type.label')} data={lineTypeOptions} sx={{ flexGrow: 1 }} {...field} />
          )}
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
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`regressions.${index}.plot.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        {t('chart.regression_line.delete')}
      </Button>
    </Stack>
  );
}
