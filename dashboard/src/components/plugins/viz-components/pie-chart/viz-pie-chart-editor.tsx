import { Divider, Group, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { FieldArrayTabs, VizConfigBanner } from '../../editor-components';
import { RadiusSlider } from './editors';
import { IPieChartConf } from './type';
import { PieColorMapEditor } from './editors/pie-color-map-editor';
import { useEditPanelContext } from '~/contexts';
import { extractData } from '~/utils';
import _ from 'lodash';
import { SeriesOrderSelector } from '../../common-echarts-fields/series-order';

type StorageData = ReturnType<typeof useStorageData<IPieChartConf>>;

type EditorProps = {
  conf: StorageData['value'];
  setConf: StorageData['set'];
} & VizConfigProps;

function Editor({ conf, setConf, context }: EditorProps) {
  const { t } = useTranslation();
  const defaultValues: IPieChartConf = useMemo(() => defaults({}, conf), [conf]);

  const { control, handleSubmit, watch, formState, reset } = useForm<IPieChartConf>({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const [label_field] = watch(['label_field', 'value_field', 'color_field', 'color']);

  const { panel } = useEditPanelContext();
  const names = useMemo(() => {
    if (!label_field) {
      return [];
    }
    const data = extractData(panel.data, label_field);
    return _.uniq(data);
  }, [label_field, panel.data]);

  return (
    <Stack gap="xs">
      <form onSubmit={handleSubmit(setConf)}>
        <VizConfigBanner canSubmit={formState.isDirty} />
        <Stack mt="md" gap="xs" p="md" mb="sm" sx={{ border: '1px solid #eee', borderRadius: '5px' }}>
          <Controller
            control={control}
            name="label_field"
            render={({ field }) => <DataFieldSelector label={t('common.name_data_field')} required {...field} />}
          />
          <Controller
            control={control}
            name="value_field"
            render={({ field }) => <DataFieldSelector label={t('common.value_data_field')} required {...field} />}
          />
          <Controller
            control={control}
            name="series_order"
            render={({ field }) => <SeriesOrderSelector label={t('chart.series_order.label')} {...field} />}
          />
          <Controller
            control={control}
            name="radius"
            render={({ field }) => <RadiusSlider label={t('viz.pie_chart.radius.label')} {...field} />}
          />
          <Divider label={t('viz.pie_chart.others_sector.title')} labelPosition="center" variant="dashed" />
          <Group grow>
            <Controller
              control={control}
              name="others_sector.label"
              render={({ field }) => (
                <TextInput
                  size="xs"
                  label={t('viz.pie_chart.others_sector.label')}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name="others_sector.threshold"
              render={({ field }) => (
                <NumberInput
                  size="xs"
                  label={t('viz.pie_chart.others_sector.threshold')}
                  suffix="%"
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
          </Group>

          <Divider label={t('chart.color.label')} labelPosition="center" variant="dashed" />
          <Controller
            control={control}
            name="color_field"
            render={({ field }) => <DataFieldSelector label={t('common.color_data_field')} clearable {...field} />}
          />

          <Controller
            control={control}
            name="color.map"
            render={({ field }) => <PieColorMapEditor names={names} {...field} />}
          />
        </Stack>
      </form>
    </Stack>
  );
}

export function VizPieChartEditor(props: VizConfigProps) {
  const { value, set } = useStorageData<IPieChartConf>(props.context.instanceData, 'config');
  if (!value) {
    return null;
  }
  return <Editor conf={value} setConf={set} {...props} />;
}
