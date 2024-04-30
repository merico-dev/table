import { Divider, Group, Select, SelectItem, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { TMericoStatsConf } from '../../type';
import { PostfixField } from './postfix-field';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  index: number;
  variableOptions: SelectItem[];
  watch: UseFormWatch<TMericoStatsConf>;
}

export function MetricField({ control, index, watch, variableOptions }: IProps) {
  const { t } = useTranslation();
  watch(`metrics.${index}.postfix`);
  return (
    <Stack my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`metrics.${index}.names.value`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('viz.merico_stats.metric.metric_name')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`metrics.${index}.data_keys.value`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('viz.merico_stats.metric.metric_data_field')}
              required
              data={variableOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`metrics.${index}.names.basis`}
          control={control}
          render={({ field }) => (
            <TextInput label={t('viz.merico_stats.metric.basis_name')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`metrics.${index}.data_keys.basis`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label={t('viz.merico_stats.metric.basis_data_field')}
              required
              data={variableOptions}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Divider mb={-15} variant="dashed" label={t('numbro.format.label')} labelPosition="center" />
      <Controller
        name={`metrics.${index}.formatter`}
        control={control}
        render={({ field }) => <NumbroFormatSelector {...field} />}
      />
      <Divider mb={-15} variant="dashed" label={t('viz.merico_stats.metric.others')} labelPosition="center" />
      <Controller
        name={`metrics.${index}.postfix`}
        control={control}
        render={({ field }) => <PostfixField {...field} />}
      />
    </Stack>
  );
}
