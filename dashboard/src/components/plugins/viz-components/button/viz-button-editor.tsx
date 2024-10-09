import { Checkbox, Divider, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MantineColorSwatches } from '~/components/panel/settings/common/mantine-color-swatches';
import { MantineSizeSelector } from '~/components/panel/settings/common/mantine-size-selector';
import { VizConfigProps } from '~/types/plugin';
import { HorizontalAlignSelector, VerticalAlignSelector, VizConfigBanner } from '../../editor-components';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outline', value: 'outline' },
  { label: 'Light', value: 'light' },
  { label: 'White', value: 'white' },
  { label: 'Default', value: 'default' },
  { label: 'Subtle', value: 'subtle' },
  { label: 'Gradient', value: 'gradient', disabled: true },
];

export function VizButtonEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues = conf;

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, formState, reset } = useForm<IButtonConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['content', 'variant', 'color', 'size', 'compact', 'horizontal_align', 'vertical_align']);
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <VizConfigBanner canSubmit={formState.isDirty} />
      <Stack>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TextInput
              label="Content Template"
              description="Filter values & context entries are supported"
              {...field}
              required
            />
          )}
        />
        <Divider mt="xs" mb={0} label="Styles" labelPosition="center" variant="dashed" />
        <SimpleGrid cols={2}>
          <Controller
            control={control}
            name="variant"
            render={({ field }) => <Select label="Variant" data={variantOptions} {...field} />}
          />
          <Controller
            control={control}
            name="color"
            render={({ field }) => <MantineColorSwatches label="Theme" {...field} />}
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Controller
            control={control}
            name="size"
            render={({ field }) => <MantineSizeSelector label="Size" {...field} />}
          />
          <Controller
            control={control}
            name="compact"
            render={({ field }) => (
              <Checkbox
                label="Compact"
                checked={field.value}
                onChange={(event) => field.onChange(event.currentTarget.checked)}
                mt={26}
              />
            )}
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Controller
            control={control}
            name="horizontal_align"
            render={({ field }) => <HorizontalAlignSelector {...field} />}
          />
          <Controller
            control={control}
            name="vertical_align"
            render={({ field }) => <VerticalAlignSelector {...field} />}
          />
        </SimpleGrid>
      </Stack>
    </form>
  );
}
