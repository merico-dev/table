import { Checkbox, Group, Stack } from '@mantine/core';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OrientationSelector } from '../../../orientation';
import { VisualMapPartialForm } from '../types';

import { SkipRangeEditor } from './skip-range-editor';
import { GradientEditor } from './gradient-editor';

type Props = {
  // TODO: solve problem at form={form} -> Types of property 'watch' are incompatible.
  form: UseFormReturn<VisualMapPartialForm>;
};

export const ContinuousVisualMapEditor = ({ form }: Props) => {
  const { t, i18n } = useTranslation();
  const control = form.control;
  const visualMap = form.watch('visualMap');
  const { type, orient } = visualMap;
  const isHorizontal = orient === 'horizontal';

  return (
    <Stack>
      <Group grow>
        <Controller
          name="visualMap.orient"
          control={control}
          render={({ field }) => <OrientationSelector sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="visualMap.calculable"
          control={control}
          render={({ field }) => (
            <Checkbox
              label={t('chart.visual_map.calculable')}
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              styles={{ root: { transform: 'translateY(12px)' } }}
            />
          )}
        />
      </Group>

      <Controller
        name="visualMap.inRange.color"
        control={control}
        render={({ field }) => <GradientEditor {...field} />}
      />
      <SkipRangeEditor form={form} />
    </Stack>
  );
};
