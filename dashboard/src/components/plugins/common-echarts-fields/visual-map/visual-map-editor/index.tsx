import { Divider, Group, NumberInput, SegmentedControl, Stack, TextInput } from '@mantine/core';
import { useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumberOrDynamicValue } from '../../number-or-dynamic-value';
import { VisualMapType } from '../types';
import { ContinuousVisualMapEditor } from './continuous';
import { PreviewVisualMap } from './preview-visual-map';
import { VisualMapPartialForm } from './types';

type Props = {
  // TODO: solve problem at form={form} -> Types of property 'watch' are incompatible.
  form: UseFormReturn<VisualMapPartialForm>;
};

export const VisualMapEditor = ({ form }: Props) => {
  const { t, i18n } = useTranslation();
  const control = form.control;
  const visualMap = form.watch('visualMap');
  const { type, orient } = visualMap;
  const isHorizontal = orient === 'horizontal';
  const getNumberChanger = (handleChange: (n: number) => void) => (v: number | '') => {
    if (v === '') {
      return;
    }
    handleChange(v);
  };

  const visualMapTypeOptions = useMemo(() => {
    return [
      {
        label: t('chart.visual_map.type.continuous'),
        value: 'continuous',
      },
      { label: t('chart.visual_map.type.piecewise'), value: 'piecewise' },
    ];
  }, [i18n.language]);

  return (
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
            onChange={(v: VisualMapType) => field.onChange(v)}
          />
        )}
      />
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
              label={isHorizontal ? t('chart.visual_map.item_height') : t('chart.visual_map.item_width')}
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
              label={isHorizontal ? t('chart.visual_map.item_width') : t('chart.visual_map.item_height')}
              {...field}
              onChange={getNumberChanger(field.onChange)}
            />
          )}
        />
      </Group>
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
      <Divider variant="dashed" />
      <ContinuousVisualMapEditor form={form} />

      {/* <pre>{JSON.stringify(visualMap, null, 2)}</pre> */}
    </Stack>
  );
};
