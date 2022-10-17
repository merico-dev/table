import { Accordion, ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { ReferenceLinesField } from './panel/reference-lines';
import { RegressionsField } from './panel/regressions';
import { SeriesField } from './panel/series';
import { StatsField } from './panel/stats';
import { VariablesField } from './panel/variables';
import { XAxisField } from './panel/x-axis';
import { YAxesField } from './panel/y-axes';
import { DEFAULT_CONFIG, ICartesianChartConf, ICartesianChartSeriesItem } from './type';

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
    barGap = '0%',
    smooth = false,
    step = false,
    group_by_key = '',
    lineStyle = { type: 'solid' },
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
      barGap,
      smooth,
      step,
      group_by_key,
      lineStyle,
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

function normalizeConf({ series, stats, ...rest }: ICartesianChartConf): ICartesianChartConf {
  return {
    series: withDefaults(series ?? []),
    stats: normalizeStats(stats),
    ...rest,
  };
}

export function VizCartesianPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const data = context.data as $TSFixMe[];
  const conf: ICartesianChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: ICartesianChartConf = useMemo(() => {
    return normalizeConf(conf);
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
              <XAxisField control={control} watch={watch} data={data} />
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
          <Accordion.Item value="Advanced">
            <Accordion.Control>
              <Group position="apart">
                Advanced
                <Text align="right" size={12} color="grey">
                  Use variables in reference lines
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Tabs defaultValue="variables">
                <Tabs.List>
                  <Tabs.Tab value="variables">Variables</Tabs.Tab>
                  <Tabs.Tab value="reference_lines">Reference Lines</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="variables" pt="xs">
                  <VariablesField control={control} watch={watch} data={data} />
                </Tabs.Panel>
                <Tabs.Panel value="reference_lines" pt="xs">
                  <ReferenceLinesField control={control} watch={watch} />
                </Tabs.Panel>
              </Tabs>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </form>
    </Stack>
  );
}
