import { SimpleGrid, Stack, Tabs } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { EchartsZoomingField } from '../cartesian/editors/echarts-zooming-field';
import { LegendField } from './editors/legend';
import { ReferenceLinesField } from './editors/reference-lines';
import { TooltipField } from './editors/tooltip';
import { XAxisField } from './editors/x-axis';
import { YAxisField } from './editors/y-axis';
import { DEFAULT_CONFIG, IBoxplotChartConf } from './type';

export function VizBoxplotChartEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: conf, set: setConf } = useStorageData<IBoxplotChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const defaultValues = useMemo(() => defaults({}, conf, DEFAULT_CONFIG), [conf]);

  const { control, handleSubmit, watch, formState, reset } = useForm<IBoxplotChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['x_axis', 'y_axis', 'reference_lines', 'color', 'dataZoom']);

  return (
    <Stack spacing="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={formState.isDirty} />
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
            <Tabs.Tab value="X Axis">{t('chart.x_axis.label')}</Tabs.Tab>
            <Tabs.Tab value="Y Axis">{t('chart.y_axis.label')}</Tabs.Tab>
            <Tabs.Tab value="Legend">{t('chart.legend.label')}</Tabs.Tab>
            <Tabs.Tab value="Tooltip">{t('chart.tooltip.label')}</Tabs.Tab>
            <Tabs.Tab value="Style">{t('chart.style.label')}</Tabs.Tab>
            <Tabs.Tab value="Reference Lines">{t('chart.reference_line.labels')}</Tabs.Tab>
            <Tabs.Tab value="Zooming">{t('chart.zooming.label')}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="X Axis">
            <XAxisField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Y Axis">
            <YAxisField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Legend">
            <LegendField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Tooltip">
            <TooltipField control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Style">
            <SimpleGrid cols={2}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
              />
            </SimpleGrid>
          </Tabs.Panel>
          <Tabs.Panel value="Reference Lines">
            <ReferenceLinesField variables={variables} control={control} watch={watch} />
          </Tabs.Panel>
          <Tabs.Panel value="Zooming">
            <Controller name="dataZoom" control={control} render={({ field }) => <EchartsZoomingField {...field} />} />
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
}
