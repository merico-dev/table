import { Stack } from '@mantine/core';
import { defaults } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { useStorageData } from '~/components/plugins/hooks';
import { VizConfigProps } from '~/types/plugin';
import { VizConfigBanner } from '../../editor-components';
import { RadiusSlider } from './editors';
import { IPieChartConf } from './type';

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

  watch(['label_field', 'value_field', 'color_field']);

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
            name="color_field"
            render={({ field }) => <DataFieldSelector label={t('common.color_data_field')} clearable {...field} />}
          />
          <Controller
            control={control}
            name="radius"
            render={({ field }) => <RadiusSlider label={t('viz.pie_chart.radius.label')} {...field} />}
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
