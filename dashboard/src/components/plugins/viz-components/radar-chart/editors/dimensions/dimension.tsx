import { Divider, Group, Stack, TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../../type';

interface IDimensionField {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
}

export function DimensionField({ control, index }: IDimensionField) {
  const { t } = useTranslation();
  return (
    <Stack my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap align="top">
        <Controller
          name={`dimensions.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`dimensions.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`dimensions.${index}.max`}
          control={control}
          rules={{
            validate: (v) => {
              if (Number.isNaN(Number(v))) {
                return t('validation.number.require_a_number');
              }
            },
          }}
          render={({ field, fieldState }) => (
            <TextInput label={t('common.max')} required sx={{ flex: 1 }} {...field} error={fieldState.error?.message} />
          )}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label={t('viz.radar_chart.metric.value_formatter')} labelPosition="center" />
        <Controller
          name={`dimensions.${index}.formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}
