import { Group, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { IParetoChartConf } from '../type';

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
      <SimpleGrid cols={2}>
        <Controller
          name="line.color"
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
    </Stack>
  );
}
