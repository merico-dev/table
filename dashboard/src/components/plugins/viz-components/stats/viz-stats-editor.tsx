import { ActionIcon, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import React from 'react';
import { DeviceFloppy } from 'tabler-icons-react';
import { VizConfigProps } from '~/types/plugin';
import { TemplateInput } from '~/utils';
import { useStorageData } from '~/components/plugins/hooks';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';
import _, { defaultsDeep } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { VizConfigBanner } from '../../editor-components';

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

export function VizStatsEditor({ context }: VizConfigProps) {
  const { value: conf, set: setConf } = useStorageData<IVizStatsConf>(context.instanceData, 'config');

  const defaultValues = React.useMemo(() => {
    return defaultsDeep({}, conf, DEFAULT_CONFIG);
  }, [conf]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IVizStatsConf>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['template', 'horizontal_align', 'vertical_align']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={changed} />
        <Controller
          name="template"
          control={control}
          render={({ field }) => <TemplateInput label="Template" py="md" sx={{ flexGrow: 1 }} {...field} />}
        />
        <SimpleGrid cols={2}>
          <Controller
            name="horizontal_align"
            control={control}
            // @ts-expect-error type of onChange
            render={({ field }) => <Select label="Horizontal Alignment" data={horizontalAlignmentOptions} {...field} />}
          />
          <Controller
            control={control}
            name="vertical_align"
            // @ts-expect-error type of onChange
            render={({ field }) => <Select label="Vertical Alignment" data={verticalAlignmentOptions} {...field} />}
          />
        </SimpleGrid>
      </form>
    </Stack>
  );
}
