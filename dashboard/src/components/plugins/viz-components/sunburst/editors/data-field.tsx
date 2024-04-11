import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { ISunburstConf } from '../type';
import { useTranslation } from 'react-i18next';

interface IDataField {
  control: Control<ISunburstConf, $TSFixMe>;
  watch: UseFormWatch<ISunburstConf>;
}
export function DataField({ control, watch }: IDataField) {
  const { t } = useTranslation();
  watch(['label_key', 'value_key', 'group_key']);
  return (
    <Stack>
      <Controller
        name="label_key"
        control={control}
        render={({ field }) => <DataFieldSelector label={t('common.name_data_field')} required {...field} />}
      />
      <Controller
        name="value_key"
        control={control}
        render={({ field }) => <DataFieldSelector label={t('common.value_data_field')} required {...field} />}
      />
      <Controller
        name="group_key"
        control={control}
        render={({ field }) => <DataFieldSelector label={t('viz.sunburst_chart.group_key')} clearable {...field} />}
      />
    </Stack>
  );
}
