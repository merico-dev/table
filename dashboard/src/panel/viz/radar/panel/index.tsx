import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '../../../settings/common/data-field-selector';
import { IRadarChartConf, IRadarChartDimension, IVizRadarChartPanel } from '../type';
import { DimensionsField } from './dimensions';

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

export function VizRadarChartPanel({ conf, setConf, data }: IVizRadarChartPanel) {
  const { dimensions, series_name_key = 'name' } = conf;
  const defaultValues = React.useMemo(
    () => ({
      dimensions: withDefaults(dimensions ?? []),
      series_name_key,
    }),
    [dimensions, series_name_key],
  );

  React.useEffect(() => {
    const configMalformed = !_.isEqual(conf, defaultValues);
    if (configMalformed) {
      setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues } = useForm<IRadarChartConf>({ defaultValues });

  watch(['series_name_key']);
  const values = getValues();
  const changed = React.useMemo(() => {
    return !_.isEqual(values, conf);
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
