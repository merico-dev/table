import { Button, Group, NumberInput, Stack } from '@mantine/core';
import { IconDeviceFloppy, IconRecycle } from '@tabler/icons-react';
import _ from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { VariableSelector } from '~/components/panel/settings/common/variable-selector';
import { GradientEditor } from '~/components/plugins/common-echarts-fields/visual-map/visual-map-editor/continuous/gradient-editor';
export type GradientColorFormValues = {
  colors: string[];
  min_val: number;
  min_var: string;
  max_val: number;
  max_var: string;
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

  const revert = useCallback(() => reset(defaultValues), [reset, defaultValues]);
  const submit = useCallback((values: GradientColorFormValues) => {
    console.log(values);
  }, []);
  return (
    <Stack>
      <Group position="apart">
        <Button color="orange" size="xs" onClick={revert} leftIcon={<IconRecycle size={18} />} disabled={!changed}>
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
          render={({ field }) => (
            <VariableSelector
              label={t('rich_text.gradient_color.choose_value_var')}
              clearable={false}
              preview="aggregated"
              {...field}
            />
          )}
        />
        <Group grow>
          <Controller
            name="min_var"
            control={control}
            render={({ field }) => (
              <VariableSelector
                label={t('rich_text.gradient_color.min.var')}
                clearable={false}
                preview="aggregated"
                {...field}
              />
            )}
          />
          <Controller
            name="min_val"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t('rich_text.gradient_color.min.val')}
                {...field}
                onChange={(v: number | '') => v !== '' && field.onChange(v)}
              />
            )}
          />
        </Group>
        <Group grow>
          <Controller
            name="max_var"
            control={control}
            render={({ field }) => (
              <VariableSelector
                label={t('rich_text.gradient_color.max.var')}
                clearable={false}
                preview="aggregated"
                {...field}
              />
            )}
          />
          <Controller
            name="max_val"
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t('rich_text.gradient_color.max.val')}
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
