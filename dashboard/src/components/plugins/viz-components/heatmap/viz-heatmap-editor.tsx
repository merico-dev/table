import { Stack, Tabs } from '@mantine/core';
import _, { defaults, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VisualMapEditor } from '../../common-echarts-fields/visual-map';
import { VizConfigBanner } from '../../editor-components';
import { HeatBlockField } from './editors/heat_block';
import { PaginationField } from './editors/pagination';
import { TooltipField } from './editors/tooltip';
import { XAxisField } from './editors/x-axis';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

export function VizHeatmapEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  const conf: IHeatmapConf = useMemo(() => {
    if (!confValue) {
      return DEFAULT_CONFIG;
    }
    return defaults({}, confValue);
  }, [confValue]);
  const defaultValues: IHeatmapConf = useMemo(() => {
    return _.cloneDeep(conf);
  }, [conf]);

  useEffect(() => {
    const configMalformed = !isEqual(conf, defaultValues);
    if (configMalformed) {
      console.log('config malformed, resetting to defaults', conf, defaultValues);
      void setConf(defaultValues);
    }
  }, [conf, defaultValues]);

  const form = useForm<IHeatmapConf>({ defaultValues });
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
            <Tabs.Tab value="Pagination">{t('common.pagination.label')}</Tabs.Tab>
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

          <Tabs.Panel value="Pagination">
            <PaginationField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
