import { Group, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { IParetoChartConf } from '../type';
import { useTranslation } from 'react-i18next';

interface ILineField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function LineField({ control, watch }: ILineField) {
  const { t } = useTranslation();
  watch(['line']);
  return (
    <Stack>
      <Group grow>
        <Controller
          name="line.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="line.nameAlignment"
          control={control}
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack spacing={2}>
        <Text size="sm">{t('chart.color.label')}</Text>
        <Controller name="line.color" control={control} render={({ field }) => <MantineColorSelector {...field} />} />
      </Stack>
    </Stack>
  );
}
