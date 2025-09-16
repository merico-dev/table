import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RichTextEditorModal } from '~/components/widgets';
import { useEditPanelContext } from '~/contexts';
import { IHorizontalBarChartConf } from '../../type';

type Props = {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
};

export const StatsField = observer(({ control }: Props) => {
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
