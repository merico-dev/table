import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor, RichTextEditorModal } from '~/components/widgets';
import { useEditPanelContext } from '~/contexts';
import { ICartesianChartConf } from '../../type';

type Props = {
  control: Control<ICartesianChartConf, $TSFixMe>;
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
          <Stack gap={4} key={`${panel.id}.stats.top`}>
            <Text size="sm" fw="bold">
              {t('chart.stats.template.above_chart')}
            </Text>
            <RichTextEditorModal
              initialValue={field.value}
              onChange={field.onChange}
              label={t('chart.stats.template.above_chart')}
            />
          </Stack>
        )}
      />
      <Controller
        name="stats.bottom"
        control={control}
        render={({ field }) => (
          <Stack gap={4} key={`${panel.id}.stats.bottom`}>
            <Text size="sm" fw="bold">
              {t('chart.stats.template.under_chart')}
            </Text>
            <RichTextEditorModal
              initialValue={field.value}
              onChange={field.onChange}
              label={t('chart.stats.template.under_chart')}
            />
          </Stack>
        )}
      />
    </Stack>
  );
});
