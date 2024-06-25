import { Divider, Group, NumberInput, SegmentedControl, Stack, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumberOrDynamicValue } from '../../number-or-dynamic-value';
import { VisualMapType } from '../types';
import { ContinuousVisualMapEditor } from './continuous';
import { PreviewVisualMap } from './preview-visual-map';
import { VisualMapPartialForm } from './types';
import { PiecewiseVisualMapEditor } from './piecewise';
import { getDefaultContinuousVisualMap, getDefaultPiecewiseVisualMap } from '../utils';
import { ErrorBoundary } from '~/utils';

type Props = {
  // TODO: solve problem at form={form} -> Types of property 'watch' are incompatible.
  form: UseFormReturn<VisualMapPartialForm>;
};

export const VisualMapEditor = ({ form }: Props) => {
  const { t, i18n } = useTranslation();
  const control = form.control;
  const visualMap = form.watch('visualMap');
  const { type, orient } = visualMap;

  const visualMapTypeOptions = useMemo(() => {
    return [
      {
        label: t('chart.visual_map.continuous.label'),
        value: 'continuous',
      },
      { label: t('chart.visual_map.piecewise.label'), value: 'piecewise' },
    ];
  }, [i18n.language]);

  const changeVisualMapType = (t: VisualMapType) => {
    switch (t) {
      case 'continuous':
        form.setValue('visualMap', getDefaultContinuousVisualMap());
        break;
      case 'piecewise':
        form.setValue('visualMap', getDefaultPiecewiseVisualMap());
        break;
    }
  };

  return (
    <ErrorBoundary>
      <Stack>
        <PreviewVisualMap visualMap={visualMap} />
        <Controller
          name="visualMap.type"
          control={control}
          render={({ field }) => (
            <SegmentedControl
              mt={-10}
              data={visualMapTypeOptions}
              sx={{ flex: 1 }}
              {...field}
              onChange={changeVisualMapType}
            />
          )}
        />
        <Group grow>
          <Controller
            name="visualMap.min"
            control={control}
            render={({ field }) => <NumberOrDynamicValue label={t('chart.visual_map.min_value')} {...field} />}
          />
          <Controller
            name="visualMap.max"
            control={control}
            render={({ field }) => <NumberOrDynamicValue label={t('chart.visual_map.max_value')} {...field} />}
          />
        </Group>
        <Divider variant="dashed" />
        <ContinuousVisualMapEditor form={form} />
        <PiecewiseVisualMapEditor form={form} />

        {/* <pre>{JSON.stringify(visualMap, null, 2)}</pre> */}
      </Stack>
    </ErrorBoundary>
  );
};
