import { Checkbox, Group, NumberInput, SegmentedControl, Stack } from '@mantine/core';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OrientationSelector } from '../../../orientation';
import { VisualMapPartialForm } from '../types';
import { useMemo } from 'react';
import { PiecewiseVisualMap } from '../../types';
import { PiecesEditor } from './pieces-editor';

type Props = {
  // TODO: solve problem at form={form} -> Types of property 'watch' are incompatible.
  form: UseFormReturn<VisualMapPartialForm>;
};

export const PiecewiseVisualMapEditor = ({ form }: Props) => {
  const { t, i18n } = useTranslation();
  const control = form.control;
  const visualMap = form.watch('visualMap') as PiecewiseVisualMap;

  const piecewiseModeOptions = useMemo(() => {
    return [
      { label: t('chart.visual_map.piecewise.mode.pieces'), value: 'pieces' },
      { label: t('chart.visual_map.piecewise.mode.categories'), value: 'categories' },
    ];
  }, [i18n.language]);

  const { type, orient, piecewise_mode } = visualMap;

  const getNumberChanger = (handleChange: (n: number) => void) => (v: number | '') => {
    if (v === '') {
      return;
    }
    handleChange(v);
  };
  if (type !== 'piecewise') {
    return null;
  }

  return (
    <Stack>
      <Controller
        name="visualMap.orient"
        control={control}
        render={({ field }) => <OrientationSelector sx={{ flex: 1 }} {...field} />}
      />
      <Group grow>
        <Controller
          name="visualMap.itemWidth"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={t('chart.visual_map.item_width')}
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
              label={t('chart.visual_map.item_height')}
              {...field}
              onChange={getNumberChanger(field.onChange)}
            />
          )}
        />
      </Group>

      <Controller
        name="visualMap.piecewise_mode"
        control={control}
        render={({ field }) => (
          <SegmentedControl
            data={piecewiseModeOptions}
            sx={{ flex: 1 }}
            {...field}
            onChange={(v: 'pieces' | 'categories') => field.onChange(v)}
          />
        )}
      />
      {piecewise_mode === 'pieces' && <PiecesEditor form={form} />}
    </Stack>
  );
};
