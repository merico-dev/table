import { Stack, Text, Group, ActionIcon, Select } from '@mantine/core';
import _, { defaultsDeep } from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { FuncContentField } from './editors/func-content';
import { DEFAULT_CONFIG, IVizTextConf } from './type';

const horizontalAlignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export function VizTextPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IVizTextConf>(context.instanceData, 'config');

  const defaultValues = React.useMemo(() => {
    const { horizontal_align, func_content } = defaultsDeep({}, conf, DEFAULT_CONFIG);
    return {
      func_content,
      horizontal_align,
    };
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizTextConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['func_content', 'horizontal_align']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Configurations</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller name="func_content" control={control} render={({ field }) => <FuncContentField {...field} />} />
        <Controller
          name="horizontal_align"
          control={control}
          render={({ field }) => <Select label="Horizontal Alignment" data={horizontalAlignmentOptions} {...field} />}
        />
      </form>
    </Stack>
  );
}
