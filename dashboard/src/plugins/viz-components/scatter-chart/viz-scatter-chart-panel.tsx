import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { EchartsZoomingField } from '../cartesian/panel/echarts-zooming-field';
// import { ReferenceAreasField } from './panel/reference-areas';
import { ReferenceLinesField } from './editors/reference-lines';
import { ScatterField } from './editors/scatter';
import { StatsField } from './editors/stats';
import { TooltipField } from './editors/tooltip';
import { XAxisField } from './editors/x-axis';
import { YAxesField } from './editors/y-axes';
import { DEFAULT_CONFIG, IScatterChartConf } from './type';

function normalizeStats(stats?: IScatterChartConf['stats']) {
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

function normalizeConf({ reference_lines = [], stats, ...rest }: IScatterChartConf): IScatterChartConf {
  return {
    reference_lines,
    stats: normalizeStats(stats),
    ...rest,
  };
}

export function VizScatterChartPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IScatterChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const data = context.data as $TSFixMe[];
  const conf: IScatterChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
  const defaultValues: IScatterChartConf = useMemo(() => {
    return normalizeConf(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<IScatterChartConf>({ defaultValues });
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
          defaultValue="X Axis"
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
            <Tabs.Tab value="Scatter">Scatter</Tabs.Tab>
            <Tabs.Tab value="Tooltip">Tooltip</Tabs.Tab>
            <Tabs.Tab value="Stats">Stats</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">Reference Lines</Tabs.Tab>
            {/* <Tabs.Tab value="Reference Areas">Reference Areas</Tabs.Tab> */}
            <Tabs.Tab value="Zooming">Zooming</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Y Axes">
            <YAxesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Scatter">
            <ScatterField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Stats">
            <StatsField control={control} watch={watch} data={data} />
          </Tabs.Panel>

          <Tabs.Panel value="Reference Lines">
            <ReferenceLinesField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>

          {/* <Tabs.Panel value="Reference Areas">
            <ReferenceAreasField variables={variables} control={control} watch={watch} />
          </Tabs.Panel> */}

          <Tabs.Panel value="Zooming">
            <Controller name="dataZoom" control={control} render={({ field }) => <EchartsZoomingField {...field} />} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
