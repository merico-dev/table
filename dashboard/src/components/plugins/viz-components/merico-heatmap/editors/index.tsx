import { Stack, Tabs } from '@mantine/core';
import _, { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { VizConfigBanner } from '~/components/plugins/editor-components';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from '../type';
import { HeatBlockField } from './heat_block';
import { TooltipField } from './tooltip';
import { XAxisField } from './x-axis';
import { YAxisField } from './y-axis';
import { useTranslation } from 'react-i18next';

export function EditMericoHeatmap({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<TMericoHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: TMericoHeatmapConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);
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

  const { control, handleSubmit, watch, getValues, reset } = useForm<TMericoHeatmapConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <form onSubmit={handleSubmit(setConf)} style={{ flexGrow: 1 }}>
      <Stack spacing="xs" sx={{ height: '100%' }}>
        <VizConfigBanner canSubmit={changed} />
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

          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
