import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DefaultAggregation } from '~/utils/aggregation';
import { EchartsZoomingField } from './panel/echarts-zooming-field';
import { ReferenceAreasField } from './panel/reference-areas';
import { ReferenceLinesField } from './panel/reference-lines';
import { RegressionsField } from './panel/regressions';
import { DEFAULT_SCATTER_SIZE } from './panel/scatter-size-select/types';
import { SeriesField } from './panel/series';
import { StatsField } from './panel/stats';
import { XAxisField } from './panel/x-axis';
import { YAxesField } from './panel/y-axes';
import { DEFAULT_CONFIG, ICartesianChartConf, ICartesianChartSeriesItem, ICartesianReferenceLine } from './type';

function withRefLineDefaults(reference_lines: ICartesianReferenceLine[]) {
  function setDefaults({
    name = '',
    template = '',
    variable_key = '',
    orientation = 'horizontal',
    ...rest
  }: ICartesianReferenceLine) {
    const ret = {
      name,
      template,
      variable_key,
      orientation,
      ...rest,
    };
    return ret;
  }

  return reference_lines.map(setDefaults);
}

function withDefaults(series: ICartesianChartSeriesItem[]) {
  function setDefaults({
    type,
    name,
    showSymbol,
    symbolSize = DEFAULT_SCATTER_SIZE.static,
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
    aggregation_on_group = DefaultAggregation,
    display_name_on_line = false,
    lineStyle = { type: 'solid', width: 1 },
    hide_in_legend = false,
  }: ICartesianChartSeriesItem) {
    const ret = {
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
      aggregation_on_group,
      display_name_on_line,
      lineStyle,
      hide_in_legend,
    };
    if (typeof symbolSize === 'number') {
      ret.symbolSize = {
        ...DEFAULT_SCATTER_SIZE.static,
        size: symbolSize,
      };
    }
    return ret;
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
    };
  }
  return stats;
}

function normalizeConf({ series, stats, reference_lines, ...rest }: ICartesianChartConf): ICartesianChartConf {
  return {
    series: withDefaults(series ?? []),
    stats: normalizeStats(stats),
    reference_lines: withRefLineDefaults(reference_lines ?? []),
    ...rest,
  };
}

export function VizCartesianPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const { variables } = context;
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

  watch(['dataZoom']);
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
            <Tabs.Tab value="Zooming">Zooming</Tabs.Tab>
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
            <ReferenceLinesField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Reference Areas">
            <ReferenceAreasField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Zooming">
            <Controller name="dataZoom" control={control} render={({ field }) => <EchartsZoomingField {...field} />} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
