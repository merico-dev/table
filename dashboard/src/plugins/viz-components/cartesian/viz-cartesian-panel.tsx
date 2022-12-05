import { Accordion, ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { ReferenceAreasField } from './panel/reference-areas';
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
    display_name_on_line = false,
    lineStyle = { type: 'solid', width: 1 },
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
      display_name_on_line,
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
        <Tabs
          defaultValue="Series"
          orientation="vertical"
          styles={{
            tab: {
              paddingLeft: '6px',
              paddingRight: '6px',
            },
            panel: {
              paddingTop: '6px',
              paddingLeft: '12px',
            },
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="X Axis">X Axis</Tabs.Tab>
            <Tabs.Tab value="Y Axes">Y Axes</Tabs.Tab>
            <Tabs.Tab value="Series">Series</Tabs.Tab>
            <Tabs.Tab value="Regression Lines">Regression Lines</Tabs.Tab>
            <Tabs.Tab value="Stats">Stats</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">Reference Lines</Tabs.Tab>
            <Tabs.Tab value="Reference Areas">Reference Areas</Tabs.Tab>
            <Tabs.Tab value="Variables">Variables</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Y Axes">
            <YAxesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Series">
            <SeriesField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Regression Lines">
            <RegressionsField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Stats">
            <StatsField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Reference Lines">
            <ReferenceLinesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Reference Areas">
            <ReferenceAreasField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Variables">
            <VariablesField control={control} watch={watch} data={data} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
