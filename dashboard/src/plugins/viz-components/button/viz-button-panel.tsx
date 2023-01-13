import {
  ActionIcon,
  Checkbox,
  Divider,
  Group,
  MantineSize,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { MantineColorSwatches } from '~/panel/settings/common/mantine-color-swatches';
import { MantineSizeSelector } from '~/panel/settings/common/mantine-size-selector';
import { VizConfigProps } from '../../../types/plugin';
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

const horizontalAlignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const verticalAlignmentOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom', value: 'bottom' },
];

export function VizButtonPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues = conf;

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IButtonConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  watch(['content', 'variant', 'color', 'size', 'compact', 'horizontal_align', 'vertical_align']);
  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
        <Text>Chart Config</Text>
        <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
          <DeviceFloppy size={20} />
        </ActionIcon>
      </Group>
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
            render={({ field }) => <Select label="Horizontal Alignment" data={horizontalAlignmentOptions} {...field} />}
          />
          <Controller
            control={control}
            name="vertical_align"
            render={({ field }) => <Select label="Vertical Alignment" data={verticalAlignmentOptions} {...field} />}
          />
        </SimpleGrid>
      </Stack>
    </form>
  );
}
