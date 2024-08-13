import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from '~/components/widgets';
import { IScatterChartConf } from '../../type';

type Props = {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
};

export function StatsField({ control, watch }: Props) {
  const { t } = useTranslation();
  return (
    <Stack>
      <Controller
        name="stats.top"
        control={control}
        render={({ field }) => (
          <CustomRichTextEditor
            label={t('chart.stats.template.above_chart')}
            styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
            autoSubmit
            {...field}
          />
        )}
      />
      <Controller
        name="stats.bottom"
        control={control}
        render={({ field }) => (
          <CustomRichTextEditor
            label={t('chart.stats.template.under_chart')}
            styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
            autoSubmit
            {...field}
          />
        )}
      />
    </Stack>
  );
}
