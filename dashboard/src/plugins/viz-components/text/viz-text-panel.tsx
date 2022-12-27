import { Stack, Text, Group, ActionIcon, Select, Divider } from '@mantine/core';
import _, { defaultsDeep, isEqual } from 'lodash';
import React, { useEffect, useMemo } from 'react';
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
  const { value: confValue, set: setConf } = useStorageData<IVizTextConf>(context.instanceData, 'config');
  const conf: IVizTextConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: IVizTextConf = useMemo(() => {
    const { func_content, horizontal_align } = conf;
    return { func_content, horizontal_align };
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

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
        <Stack spacing={10}>
          <Controller name="func_content" control={control} render={({ field }) => <FuncContentField {...field} />} />
          <Divider mt={10} mb={-10} variant="dashed" label="Style" labelPosition="center" />
          <Controller
            name="horizontal_align"
            control={control}
            render={({ field }) => <Select label="Horizontal Alignment" data={horizontalAlignmentOptions} {...field} />}
          />
        </Stack>
      </form>
    </Stack>
  );
}
