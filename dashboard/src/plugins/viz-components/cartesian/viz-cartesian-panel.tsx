import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, Group, Stack, Accordion, ActionIcon, TextInput } from '@mantine/core';

import { VizConfigProps } from '~/types/plugin';
import { useStorageData } from '~/plugins/hooks';
import { StatsField } from './panel/stats';
import { DEFAULT_CONFIG, ICartesianChartConf, ICartesianChartSeriesItem } from './type';
import { RegressionsField } from './panel/regressions';
import { SeriesField } from './panel/series';
import { YAxesField } from './panel/y-axes';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { DeviceFloppy } from 'tabler-icons-react';

function withDefaults(series: ICartesianChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    symbolSize = 5,
    y_axis_data_key = 'value',
    yAxisIndex = 0,
    label_position = 'top',
    stack = '1',
    color = 'black',
    barWidth = '30',
    smooth = false,
    step = false,
    group_by_key = '',
  }: ICartesianChartSeriesItem) {
    return {
      type,
      name,
      showSymbol,
      symbolSize,
      y_axis_data_key,
      yAxisIndex,
      label_position,
      stack,
      color,
      barWidth,
      smooth,
      step,
      group_by_key,
    };
  }

  return series.map(setDefaults);
}

function normalizeStats(stats?: ICartesianChartConf['stats']) {
  if (!stats) {
    return {
      templates: {
        top: '',
        bottom: '',
      },
      variables: [],
    };
  }
  return stats;
}

export function VizCartesianPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const data = context.data as any[];
  const conf: ICartesianChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ICartesianChartConf = useMemo(() => {
    const { series, stats, ...rest } = conf;
    return {
      series: withDefaults(series ?? []),
      stats: normalizeStats(stats),
      ...rest,
    };
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ICartesianChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis_data_key', 'x_axis_name']);
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
        <Accordion multiple defaultValue={['X Axis', 'Y Axes']}>
          <Accordion.Item value="X Axis">
            <Accordion.Control>X Axis</Accordion.Control>
            <Accordion.Panel>
              <Group grow noWrap>
                <Controller
                  name="x_axis_data_key"
                  control={control}
                  render={({ field }) => (
                    <DataFieldSelector label="X Axis Data Field" required data={data} sx={{ flex: 1 }} {...field} />
                  )}
                />
                <Controller
                  name="x_axis_name"
                  control={control}
                  render={({ field }) => <TextInput label="X Axis Name" sx={{ flex: 1 }} {...field} />}
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Y Axes">
            <Accordion.Control>Y Axes</Accordion.Control>
            <Accordion.Panel>
              <YAxesField control={control} watch={watch} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Series">
            <Accordion.Control>Series</Accordion.Control>
            <Accordion.Panel>
              <SeriesField control={control} watch={watch} data={data} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Regression Lines">
            <Accordion.Control>Regression Lines</Accordion.Control>
            <Accordion.Panel>
              <RegressionsField control={control} watch={watch} data={data} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="Stats">
            <Accordion.Control>Stats</Accordion.Control>
            <Accordion.Panel>
              <StatsField control={control} watch={watch} data={data} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Stack>
  );
}
