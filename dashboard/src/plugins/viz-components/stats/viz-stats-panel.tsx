import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '../../../types/plugin';
import { TemplateInput } from '../../../utils/template';
import { useStorageData } from '../../hooks';
import { VariablesField } from './panel/variables';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';
import _, { defaultsDeep } from 'lodash';
import { Controller, useForm } from 'react-hook-form';

export function VizStatsPanel({ context }: VizConfigProps) {
  const data = (context.data as Record<string, number>[]) || [];
  const { value: conf, set: setConf } = useStorageData<IVizStatsConf>(context.instanceData, 'config');

  const defaultValues = React.useMemo(() => {
    const { align, template = '', variables = [] } = defaultsDeep({}, conf, DEFAULT_CONFIG);
    return {
      variables,
      template,
      align,
    };
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizStatsConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['variables', 'template']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack mt="md" spacing="xs">
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
        <Text pb="sm" pt="md" size="sm">
          Variables
        </Text>
        <VariablesField control={control} watch={watch} data={data} />
      </form>
    </Stack>
  );
}
