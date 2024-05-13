import { Controller, ControllerRenderProps, FieldPath, UseFormReturn, useFieldArray } from 'react-hook-form';
import { VisualMapPartialForm } from './types';
import { CloseButton, ColorInput, Group, Stack, Table } from '@mantine/core';

type FieldType = ControllerRenderProps<
  VisualMapPartialForm,
  'visualMap.skipRange.lt_min' | 'visualMap.skipRange.min' | 'visualMap.skipRange.max' | 'visualMap.skipRange.gt_max'
>;

type SkipRangeColorInputProps = {
  field: FieldType;
  label: string;
};
const SkipRangeColorInput = ({ label, field }: SkipRangeColorInputProps) => {
  return (
    <ColorInput
      label={label}
      placeholder="follow gradient rule"
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
  return (
    <Stack>
      <Controller
        control={form.control}
        name="visualMap.skipRange.lt_min"
        render={({ field }) => <SkipRangeColorInput field={field} label="Color for smaller values than min value" />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.min"
        render={({ field }) => <SkipRangeColorInput field={field} label="Color for min value" />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.max"
        render={({ field }) => <SkipRangeColorInput field={field} label="Color for max value" />}
      />
      <Controller
        control={form.control}
        name="visualMap.skipRange.gt_max"
        render={({ field }) => <SkipRangeColorInput field={field} label="Color for greater values than max value" />}
      />
    </Stack>
  );
};
