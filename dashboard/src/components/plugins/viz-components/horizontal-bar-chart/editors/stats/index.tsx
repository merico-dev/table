import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomRichTextEditor } from '~/components/widgets';
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
