import { Box, Button, CloseButton, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowBackUp, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { VariableSelector } from '~/components/panel/settings/common/variable-selector';
import { GradientEditor } from '~/components/plugins/common-echarts-fields/visual-map/visual-map-editor/continuous/gradient-editor';
export type ColorMappingFormValues = {
  colors: string[];
  min_val: string;
  min_var: string;
  max_val: string;
  max_var: string;
  variable: string;
};

type Props = {
  defaultValues: ColorMappingFormValues;
  onSubmit: (values: ColorMappingFormValues) => void;
  cancel: () => void;
  unset: () => void;
};
export const ColorMappingForm = ({ defaultValues, onSubmit, unset, cancel }: Props) => {
  const { t } = useTranslation();
  const form = useForm<ColorMappingFormValues>({ defaultValues });
  const { control, handleSubmit, watch, getValues, reset } = form;
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const revert = useCallback(() => reset(defaultValues), [reset, defaultValues]);
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group position="apart" px="1rem" pt="0.75rem">
          <Text>{t('rich_text.color_mapping.edit')}</Text>
          <CloseButton onClick={cancel} />
        </Group>
        <Divider color="rgb(206, 212, 218)" variant="dotted" my="1rem" />
        <Box px="1rem">
          <Controller
            control={control}
            name="variable"
            render={({ field }) => (
              <VariableSelector
                label={t('rich_text.color_mapping.choose_value_var')}
                clearable={false}
                preview="aggregated"
                {...field}
              />
            )}
          />
          <Group grow position="apart">
            <Controller
              name="min_var"
              control={control}
              render={({ field }) => (
                <VariableSelector
                  label={t('rich_text.color_mapping.min.var')}
                  clearable={false}
                  preview="aggregated"
                  sx={{ flexGrow: 1, maxWidth: 'unset' }}
                  {...field}
                />
              )}
            />
            <Controller
              name="min_val"
              control={control}
              render={({ field }) => (
                <TextInput
                  label={t('rich_text.color_mapping.min.val')}
                  {...field}
                  sx={{ maxWidth: '120px', flexGrow: 0 }}
                />
              )}
            />
          </Group>
          <Group grow position="apart">
            <Controller
              name="max_var"
              control={control}
              render={({ field }) => (
                <VariableSelector
                  label={t('rich_text.color_mapping.max.var')}
                  clearable={false}
                  preview="aggregated"
                  sx={{ flexGrow: 1, maxWidth: 'unset' }}
                  {...field}
                />
              )}
            />
            <Controller
              name="max_val"
              control={control}
              render={({ field }) => (
                <TextInput
                  label={t('rich_text.color_mapping.max.val')}
                  {...field}
                  sx={{ maxWidth: '120px', flexGrow: 0 }}
                />
              )}
            />
          </Group>
          <Controller control={control} name="colors" render={({ field }) => <GradientEditor {...field} />} />
        </Box>
        <Divider color="rgb(206, 212, 218)" variant="dotted" my="1rem" />
        <Group position="apart" px="1rem" pb="0.75rem">
          <Group position="left">
            <Button color="red" size="xs" onClick={revert} leftIcon={<IconTrash size={18} />}>
              {t('common.actions.clear')}
            </Button>
            <Button color="orange" size="xs" onClick={revert} leftIcon={<IconArrowBackUp size={18} />}>
              {t('common.actions.revert')}
            </Button>
          </Group>
          <Button color="green" size="xs" type="submit" leftIcon={<IconDeviceFloppy size={18} />}>
            {t('common.actions.save_changes')}
          </Button>
        </Group>
      </form>
    </Box>
  );
};
