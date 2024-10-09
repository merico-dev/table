import { Group, NumberInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { IRegressionChartConf } from '../type';

interface IRegressionField {
  control: Control<IRegressionChartConf, $TSFixMe>;
  watch: UseFormWatch<IRegressionChartConf>;
}

export function RegressionField({ control, watch }: IRegressionField) {
  const { t, i18n } = useTranslation();
  watch('regression');
  const method = watch('regression.transform.config.method');
  const group_by_key = watch('regression.group_by_key');

  const regressionOptions = useMemo(
    () => [
      { label: t('chart.regression_line.method.linear'), value: 'linear' },
      { label: t('chart.regression_line.method.exponential'), value: 'exponential' },
      { label: t('chart.regression_line.method.logistic'), value: 'logistic' },
      { label: t('chart.regression_line.method.polynomial'), value: 'polynomial' },
    ],
    [i18n.language],
  );

  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`regression.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name="regression.group_by_key"
        control={control}
        render={({ field }) => (
          <DataFieldSelector label={t('chart.series.group_by.label')} clearable sx={{ flex: 1 }} {...field} />
        )}
      />
      <Group grow noWrap>
        <Controller
          name={`regression.transform.config.method`}
          control={control}
          render={({ field }) => (
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
            name={`regression.transform.config.order`}
            control={control}
            render={({ field }) => (
              <NumberInput label={t('chart.regression_line.method.polynomial_order')} sx={{ flex: 1 }} {...field} />
            )}
          />
        )}
      </Group>
      {!group_by_key && (
        <SimpleGrid cols={2}>
          <Controller
            name={`regression.plot.color`}
            control={control}
            render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
          />
        </SimpleGrid>
      )}
    </Stack>
  );
}
