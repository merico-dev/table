import { ActionIcon, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeviceFloppy } from 'tabler-icons-react';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { EchartsZoomingField } from './editors/echarts-zooming-field';
import { ReferenceAreasField } from './editors/reference-areas';
import { ReferenceLinesField } from './editors/reference-lines';
import { RegressionsField } from './editors/regressions';
import { SeriesField } from './editors/series';
import { StatsField } from './editors/stats';
import { XAxisField } from './editors/x-axis';
import { YAxesField } from './editors/y-axes';
import { DEFAULT_CONFIG, ICartesianChartConf } from './type';
import { TooltipField } from './editors/tooltip';
import { useTranslation } from 'react-i18next';

export function VizCartesianEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<ICartesianChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const defaultValues: ICartesianChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset } = useForm<ICartesianChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, defaultValues);
  }, [values, defaultValues]);

  watch(['dataZoom']);
  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <Group position="left" py="md" pl="md" sx={{ borderBottom: '1px solid #eee', background: '#efefef' }}>
          <Text>{t('chart.chart_config')}</Text>
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
            <Tabs.Tab value="X Axis">{t('chart.x_axis.label')}</Tabs.Tab>
            <Tabs.Tab value="Y Axes">{t('chart.y_axis.labels')}</Tabs.Tab>
            <Tabs.Tab value="Series">{t('chart.series.label')}</Tabs.Tab>
            <Tabs.Tab value="Regression Lines">{t('chart.regression_line.labels')}</Tabs.Tab>
            <Tabs.Tab value="Tooltip">{t('chart.tooltip.label')}</Tabs.Tab>
            <Tabs.Tab value="Stats">{t('chart.stats.label')}</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">{t('chart.reference_line.labels')}</Tabs.Tab>
            <Tabs.Tab value="Reference Areas">{t('chart.reference_area.labels')}</Tabs.Tab>
            <Tabs.Tab value="Zooming">{t('chart.zooming.label')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Y Axes">
            <YAxesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Series">
            <SeriesField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Regression Lines">
            <RegressionsField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Stats">
            <StatsField control={control} watch={watch} />
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
