import { Stack, Tabs } from '@mantine/core';
import _, { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { VisualMapEditor } from '~/components/plugins/common-echarts-fields/visual-map';
import { VizConfigBanner } from '~/components/plugins/editor-components';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from '../type';
import { HeatBlockField } from './heat_block';
import { TooltipField } from './tooltip';
import { XAxisField } from './x-axis';
import { YAxisField } from './y-axis';

export function EditMericoHeatmap({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<TMericoHeatmapConf>(context.instanceData, 'config');
  const conf: TMericoHeatmapConf = useMemo(() => {
    if (!confValue) {
      return DEFAULT_CONFIG;
    }
    return defaults({}, confValue);
  }, [confValue]);
  const defaultValues: TMericoHeatmapConf = useMemo(() => {
    return _.cloneDeep(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const form = useForm<TMericoHeatmapConf>({ defaultValues });
  const { control, handleSubmit, watch, formState, reset } = form;
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(setConf)} style={{ flexGrow: 1 }}>
      <Stack gap="xs" sx={{ height: '100%' }}>
        <VizConfigBanner canSubmit={formState.isDirty} />
        <Tabs
          defaultValue="X Axis"
          orientation="vertical"
          styles={{
            root: {
              // height: '100%',
              flexGrow: 1,
            },
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
            <Tabs.Tab value="Y Axis">{t('chart.y_axis.label')}</Tabs.Tab>
            <Tabs.Tab value="Heat Block">{t('chart.heatmap.heatblock.label')}</Tabs.Tab>
            <Tabs.Tab value="Visual Map">{t('chart.visual_map.label')}</Tabs.Tab>
            <Tabs.Tab value="Tooltip">{t('chart.tooltip.label')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="Y Axis">
            <YAxisField control={control} watch={watch} />
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
      </Stack>
    </form>
  );
}
