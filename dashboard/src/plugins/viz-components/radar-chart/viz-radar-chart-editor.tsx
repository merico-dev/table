import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';

import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DimensionsField } from './editors/dimensions/dimensions';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

export function VizRadarChartEditor({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const conf: IRadarChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRadarChartConf>({ defaultValues: conf });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  watch(['series_name_key']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Radar Config</Text>
          <ActionIcon type="submit" mr={5} variant="filled" color="blue" disabled={!changed}>
            <DeviceFloppy size={20} />
          </ActionIcon>
        </Group>

        <Box py="sm">
          <Controller
            name="series_name_key"
            control={control}
            render={({ field }) => (
              <DataFieldSelector label="Series Name Field" required data={data} sx={{ flex: 1 }} {...field} />
            )}
          />
        </Box>

        <DimensionsField control={control} watch={watch} data={data} />
      </Stack>
    </form>
  );
}
