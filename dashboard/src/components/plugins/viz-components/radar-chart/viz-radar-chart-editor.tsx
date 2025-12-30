import { Checkbox, Divider, Group, Stack, Tabs } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useEditPanelContext } from '~/contexts';
import { extractData } from '~/utils';

import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { NameColorMapEditor, VizConfigBanner } from '../../editor-components';
import { AdditionalSeriesField } from './editors/additional-series';
import { DimensionsField } from './editors/dimensions';
import { RadarSeriesStyleField } from './editors/series-style-field';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';

export function VizRadarChartEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IRadarChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, reset, formState } = useForm<IRadarChartConf>({
    defaultValues: conf,
    mode: 'all',
  });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  const [color_field] = watch(['series_name_key', 'background', 'label', 'main_series_style', 'color_field', 'color']);

  const { panel } = useEditPanelContext();
  const names = useMemo(() => {
    if (!color_field) {
      return [];
    }
    const data = extractData(panel.data, color_field);
    return _.uniq(data);
  }, [color_field, panel.data]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack gap="xs">
        <VizConfigBanner canSubmit={formState.isDirty && formState.isValid} />
        <Tabs defaultValue="series">
          <Tabs.List>
            <Tabs.Tab value="series">{t('chart.series.label')}</Tabs.Tab>
            <Tabs.Tab value="metrics">{t('viz.radar_chart.metric.labels')}</Tabs.Tab>
            <Tabs.Tab value="style">{t('chart.style.label')}</Tabs.Tab>
            <Tabs.Tab value="additional_series" ml="auto">
              {t('viz.radar_chart.additional_series.label')}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="series" p="md">
            <Controller
              name="series_name_key"
              control={control}
              render={({ field }) => (
                <DataFieldSelector
                  label={t('viz.radar_chart.series.series_name_field')}
                  required
                  sx={{ flex: 1 }}
                  {...field}
                />
              )}
            />
          </Tabs.Panel>

          <Tabs.Panel value="metrics" p="md">
            <DimensionsField control={control} watch={watch} />
          </Tabs.Panel>

          <Tabs.Panel value="style" p="md">
            <Stack gap="md">
              <Group grow wrap="nowrap">
                <Controller
                  name="background.enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label={t('viz.radar_chart.style.show_background')}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                    />
                  )}
                />
                <Controller
                  name="label.enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label={t('viz.radar_chart.style.show_value_label')}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.currentTarget.checked)}
                    />
                  )}
                />
              </Group>
              <RadarSeriesStyleField control={control} path="main_series_style" />
              <Divider label={t('chart.color.label')} labelPosition="center" variant="dashed" />
              <Controller
                name="color_field"
                control={control}
                render={({ field }) => (
                  <DataFieldSelector label={t('common.color_data_field')} clearable sx={{ flex: 1 }} {...field} />
                )}
              />
              <Controller
                name="color.map"
                control={control}
                render={({ field }) => <NameColorMapEditor names={names} {...field} />}
              />
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="additional_series" p="md">
            <AdditionalSeriesField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
