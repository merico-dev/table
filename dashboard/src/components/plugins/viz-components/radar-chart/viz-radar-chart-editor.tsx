import { ActionIcon, Checkbox, Group, Stack, Tabs, Text } from '@mantine/core';
import { defaultsDeep, isEqual } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DeviceFloppy } from 'tabler-icons-react';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';

import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { AdditionalSeriesField } from './editors/additional-series';
import { DimensionsField } from './editors/dimensions';
import { DEFAULT_CONFIG, IRadarChartConf } from './type';
import { VizConfigBanner } from '../../editor-components';
import { useTranslation } from 'react-i18next';

export function VizRadarChartEditor({ context }: VizConfigProps) {
  const { t } = useTranslation();
  const { value: confValue, set: setConf } = useStorageData<IRadarChartConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf: IRadarChartConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { control, handleSubmit, watch, getValues, reset, formState } = useForm<IRadarChartConf>({
    defaultValues: conf,
    mode: 'all',
  });
  useEffect(() => {
    reset(conf);
  }, [conf]);

  watch(['series_name_key', 'background', 'label']);
  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, conf);
  }, [values, conf]);

  return (
    <form onSubmit={handleSubmit(setConf)}>
      <Stack spacing="xs">
        <VizConfigBanner canSubmit={changed && formState.isValid} />
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
            <Group grow noWrap>
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
          </Tabs.Panel>
          <Tabs.Panel value="additional_series" p="md">
            <AdditionalSeriesField control={control} watch={watch} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </form>
  );
}
