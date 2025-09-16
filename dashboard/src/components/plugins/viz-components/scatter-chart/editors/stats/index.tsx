import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RichTextEditorModal } from '~/components/widgets';
import { useEditPanelContext } from '~/contexts';
import { IScatterChartConf } from '../../type';

type Props = {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
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
          <RichTextEditorModal
            key={`${panel.id}.stats.top`}
            initialValue={field.value}
            onChange={field.onChange}
            label={t('chart.stats.template.above_chart')}
          />
        )}
      />
      <Controller
        name="stats.bottom"
        control={control}
        render={({ field }) => (
          <RichTextEditorModal
            key={`${panel.id}.stats.bottom`}
            initialValue={field.value}
            onChange={field.onChange}
            label={t('chart.stats.template.under_chart')}
          />
        )}
      />
    </Stack>
  );
});
