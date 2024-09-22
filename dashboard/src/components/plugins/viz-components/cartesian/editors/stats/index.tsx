import { Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from '~/components/widgets';
import { ICartesianChartConf } from '../../type';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts';

type Props = {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
};

export const StatsField = observer(({ control, watch }: Props) => {
  const { panel } = useEditPanelContext();
  const { t } = useTranslation();
  return (
    <Stack>
      <Controller
        name="stats.top"
        control={control}
        render={({ field }) => (
          <CustomRichTextEditor
            key={`${panel.id}.stats.top`}
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
            key={`${panel.id}.stats.bottom`}
            label={t('chart.stats.template.under_chart')}
            styles={{ root: { flexGrow: 1, minHeight: '240px' } }}
            autoSubmit
            {...field}
          />
        )}
      />
    </Stack>
  );
});
