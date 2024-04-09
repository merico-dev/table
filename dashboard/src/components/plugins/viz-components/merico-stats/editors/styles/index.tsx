import { Divider, Group } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AlignItemsSelector, JustifyContentSelector } from '~/components/plugins/editor-components';
import { TMericoStatsConf } from '../../type';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  watch: UseFormWatch<TMericoStatsConf>;
}

export function StylesField({ control, watch }: IProps) {
  const { t } = useTranslation();
  watch('styles');
  return (
    <>
      <Divider mt={15} variant="dashed" label={t('style.label')} labelPosition="center" />
      <Group>
        <Controller
          name={'styles.justify'}
          control={control}
          render={({ field }) => <JustifyContentSelector sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={'styles.align'}
          control={control}
          render={({ field }) => (
            <AlignItemsSelector label={t('viz.merico_stats.align_items.label')} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
    </>
  );
}
