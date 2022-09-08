import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Stack, Text, Box, Group, ActionIcon } from '@mantine/core';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';

import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { DimensionsField } from './panel/dimensions';
import { DEFAULT_CONFIG, IRadarChartConf, IRadarChartDimension } from './type';

function withDefaults(dimensions: IRadarChartDimension[]) {
  function setDefaults({ name = '', data_key = '', max = 10, color = 'blue' }: IRadarChartDimension) {
    return {
      name,
      data_key,
      max,
      color,
    };
  }

  return dimensions.map(setDefaults);
}

export function VizRadarChartPanel({ context }: VizConfigProps) {
  const data = context.data as any[];
  const { value: confValue, set: setConf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const conf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const { dimensions, series_name_key } = conf;
  const defaultValues = useMemo(
    () => ({
      dimensions: withDefaults(dimensions ?? []),
      series_name_key,
    }),
    [dimensions, series_name_key],
  );
  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IRadarChartConf>({ defaultValues });

  useEffect(() => {
    if (!isEqual(getValues(), defaultValues)) {
      reset(defaultValues);
    }
  }, [conf]);

  watch(['series_name_key']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack mt="md" spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>Chart Config</Text>
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
      </form>
    </Stack>
  );
}
