import { Button, Group, NumberInput, Stack, TextInput } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GradientEditor } from '~/components/plugins/common-echarts-fields/visual-map/visual-map-editor/continuous/gradient-editor';
export type GradientColorFormValues = {
  colors: string[];
  min: number;
  max: number;
  variable: string;
};

type Props = {
  defaultValues: GradientColorFormValues;
};
export const GradientColorForm = ({ defaultValues }: Props) => {
  const { t } = useTranslation();
  const form = useForm<GradientColorFormValues>({ defaultValues });
  const { control, handleSubmit, watch, getValues, reset } = form;
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return _.isEqual(values, defaultValues);
  }, [values, defaultValues]);

  const revert = () => reset(defaultValues);
  const submit = (values: GradientColorFormValues) => console.log(values);
  return (
    <Stack>
      <Group position="apart">
        <Button
          color="orange"
          size="xs"
          onClick={() => reset()}
          leftIcon={<IconRecycle size={18} />}
          disabled={!changed}
        >
          {t('common.actions.revert')}
        </Button>
        <Button color="green" size="xs" type="submit" leftIcon={<IconDeviceFloppy size={18} />} disabled={!changed}>
          {t('common.actions.save_changes')}
        </Button>
      </Group>
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="variable"
          render={({ field }) => <TextInput label={t('rich_text.gradient_color.choose_value_var')} {...field} />}
        />
        <Group grow>
          <Controller
            name="min"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t('rich_text.gradient_color.min_value')}
                {...field}
                onChange={(v: number | '') => v !== '' && field.onChange(v)}
              />
            )}
          />
          <Controller
            name="max"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t('rich_text.gradient_color.max_value')}
                {...field}
                onChange={(v: number | '') => v !== '' && field.onChange(v)}
              />
            )}
          />
        </Group>
        <Controller control={control} name="colors" render={({ field }) => <GradientEditor {...field} />} />
      </form>
    </Stack>
  );
};
