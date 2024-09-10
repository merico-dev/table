import { Divider, Group, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NumbroFormatSelector } from '~/components/panel/settings/common/numbro-format-selector';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { IParetoChartConf } from '../type';

interface IBarField {
  control: Control<IParetoChartConf, $TSFixMe>;
  watch: UseFormWatch<IParetoChartConf>;
}
export function BarField({ control, watch }: IBarField) {
  const { t } = useTranslation();
  watch(['bar']);
  return (
    <Stack>
      <Group grow>
        <Controller
          name="bar.name"
          control={control}
          render={({ field }) => <TextInput label={t('common.name')} sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="bar.nameAlignment"
          control={control}
          render={({ field }) => <NameTextAlignSelector sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <SimpleGrid cols={2}>
        <Controller
          name="bar.color"
          control={control}
          render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
        />
      </SimpleGrid>
      <Stack>
        <Divider mb={-15} variant="dashed" label={t('chart.label.label_format')} labelPosition="center" />
        <Controller
          name="bar.label_formatter"
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
    </Stack>
  );
}
