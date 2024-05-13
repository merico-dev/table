import { Controller, ControllerRenderProps, FieldPath, UseFormReturn, useFieldArray } from 'react-hook-form';
import { VisualMapPartialForm } from './types';
import { CloseButton, ColorInput, Group, Stack, Table } from '@mantine/core';
import { useTranslation } from 'react-i18next';

type FieldType = ControllerRenderProps<
  VisualMapPartialForm,
  'visualMap.skipRange.lt_min' | 'visualMap.skipRange.min' | 'visualMap.skipRange.max' | 'visualMap.skipRange.gt_max'
>;

type SkipRangeColorInputProps = {
  field: FieldType;
  label: string;
};
const SkipRangeColorInput = ({ label, field }: SkipRangeColorInputProps) => {
  const { t } = useTranslation();
  return (
    <ColorInput
      label={label}
      placeholder={t('chart.visual_map.skip_range.follow_visual_map')}
      size="xs"
      withinPortal
      dropdownZIndex={340}
      rightSection={
        !!field.value ? (
          <CloseButton
            onClick={() => {
              field.onChange('');
            }}
          />
        ) : null
      }
      {...field}
    />
  );
};

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
};

export const SkipRangeEditor = ({ form }: Props) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Controller
        control={form.control}
        name="visualMap.skipRange.lt_min"
        render={({ field }) => <SkipRangeColorInput field={field} label={t('chart.visual_map.skip_range.lt_min')} />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.min"
        render={({ field }) => <SkipRangeColorInput field={field} label={t('chart.visual_map.skip_range.min')} />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.max"
        render={({ field }) => <SkipRangeColorInput field={field} label={t('chart.visual_map.skip_range.max')} />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.gt_max"
        render={({ field }) => <SkipRangeColorInput field={field} label={t('chart.visual_map.skip_range.gt_max')} />}
      />
    </Stack>
  );
};
