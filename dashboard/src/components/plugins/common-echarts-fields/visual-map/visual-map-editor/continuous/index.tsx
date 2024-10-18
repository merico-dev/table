import { Checkbox, Group, NumberInput, Stack, TextInput } from '@mantine/core';
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
  const getNumberChanger = (handleChange: (n: number) => void) => (v: number | string) => {
    if (typeof v === 'string') {
      return;
    }
    handleChange(v);
  };
  if (type !== 'continuous') {
    return null;
  }
  return (
    <Stack>
      <Group grow>
        <Controller
          name="visualMap.text.1"
          control={control}
          render={({ field }) => <TextInput label={t('chart.visual_map.min_text')} {...field} />}
        />
        <Controller
          name="visualMap.text.0"
          control={control}
          render={({ field }) => <TextInput label={t('chart.visual_map.max_text')} {...field} />}
        />
      </Group>
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
      <Group
        grow
        styles={{
          root: {
            flexDirection: isHorizontal ? 'row-reverse' : 'row',
          },
        }}
      >
        <Controller
          name="visualMap.itemWidth"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={isHorizontal ? t('chart.visual_map.bar_height') : t('chart.visual_map.bar_width')}
              {...field}
              onChange={getNumberChanger(field.onChange)}
            />
          )}
        />
        <Controller
          name="visualMap.itemHeight"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={isHorizontal ? t('chart.visual_map.bar_width') : t('chart.visual_map.bar_height')}
              {...field}
              onChange={getNumberChanger(field.onChange)}
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
