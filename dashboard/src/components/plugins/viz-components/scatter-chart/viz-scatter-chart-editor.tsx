import { Stack, Tabs } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { EchartsZoomingField } from '../cartesian/editors/echarts-zooming-field';
import { ReferenceAreasField } from './editors/reference-areas';
import { ReferenceLinesField } from './editors/reference-lines';
import { ScatterField } from './editors/scatter';
import { StatsField } from './editors/stats';
import { TooltipField } from './editors/tooltip';
import { XAxisField } from './editors/x-axis';
import { YAxesField } from './editors/y-axes';
import { IScatterChartConf } from './type';

type StorageData = ReturnType<typeof useStorageData<IScatterChartConf>>;

type EditorProps = {
  conf: StorageData['value'];
  setConf: StorageData['set'];
} & VizConfigProps;

function Editor({ conf, setConf, context }: EditorProps) {
  const { t } = useTranslation();
  const { variables } = context;
  const defaultValues: IScatterChartConf = useMemo(() => defaults({}, conf), [conf]);

  const { control, handleSubmit, watch, reset, formState } = useForm<IScatterChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  watch(['dataZoom']);
  return (
    <Stack gap="xs">
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
            <Tabs.Tab value="Y Axes">{t('chart.y_axis.labels')}</Tabs.Tab>
            <Tabs.Tab value="Scatter">{t('chart.series.scatter.label')}</Tabs.Tab>
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

          <Tabs.Panel value="Scatter">
            <ScatterField control={control} watch={watch} />
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

export function VizScatterChartEditor(props: VizConfigProps) {
  const { value, set } = useStorageData<IScatterChartConf>(props.context.instanceData, 'config');
  if (!value) {
    return null;
  }
  return <Editor conf={value} setConf={set} {...props} />;
}
