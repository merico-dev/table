import { Stack, Tabs } from '@mantine/core';
import _, { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VisualMapEditor } from '../../common-echarts-fields/visual-map';
import { VizConfigBanner } from '../../editor-components';
import { CalendarField } from './editors/calendar';
import { HeatBlockField } from './editors/heat_block';
import { TooltipField } from './editors/tooltip';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';

export function VizCalendarHeatmapEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<ICalendarHeatmapConf>(context.instanceData, 'config');

  const conf: ICalendarHeatmapConf = useMemo(() => {
    if (!confValue) {
      return DEFAULT_CONFIG;
    }
    return defaults({}, confValue);
  }, [confValue]);

  const defaultValues: ICalendarHeatmapConf = useMemo(() => {
    return _.cloneDeep(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const form = useForm<ICalendarHeatmapConf>({ defaultValues });
  const { control, handleSubmit, watch, getValues, reset } = form;
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={changed} />
        <Tabs
          defaultValue="Calendar"
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
            <Tabs.Tab value="Calendar">{t('viz.calendar_heatmap.calendar.label')}</Tabs.Tab>
            <Tabs.Tab value="Heat Block">{t('chart.heatmap.heatblock.label')}</Tabs.Tab>
            <Tabs.Tab value="Visual Map">{t('chart.visual_map.label')}</Tabs.Tab>
            <Tabs.Tab value="Tooltip">{t('chart.tooltip.label')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Calendar">
            <CalendarField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Heat Block">
            <HeatBlockField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Visual Map">
            {/* @ts-expect-error Types of property 'watch' are incompatible. */}
            <VisualMapEditor form={form} />
          </Tabs.Panel>

          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
