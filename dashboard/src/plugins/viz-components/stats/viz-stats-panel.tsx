import { ActionIcon, Group, Select, Stack, Text } from '@mantine/core';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '~/types/plugin';
import { TemplateInput } from '~/utils/template';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';
import _, { defaultsDeep } from 'lodash';
import { Controller, useForm } from 'react-hook-form';

const horizontalAlignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export function VizStatsPanel({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IVizStatsConf>(context.instanceData, 'config');

  const defaultValues = React.useMemo(() => {
    const { align, template = '' } = defaultsDeep({}, conf, DEFAULT_CONFIG);
    return {
      template,
      align,
    };
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizStatsConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['template', 'align']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text weight={500}>Stats Configurations</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>
        <Controller
          name="template"
          control={control}
          render={({ field }) => <TemplateInput label="Template" py="md" sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name="align"
          control={control}
          render={({ field }) => <Select label="Horizontal Alignment" data={horizontalAlignmentOptions} {...field} />}
        />
      </form>
    </Stack>
  );
}
