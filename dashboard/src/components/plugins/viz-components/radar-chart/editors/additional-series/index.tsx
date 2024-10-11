import { Alert, Mark } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { Control, UseFormWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { IRadarChartConf, TAdditionalSeriesItem } from '../../type';
import { AdditionalSeriesItemField } from './additional-series-item';

type Props = {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
};

export function AdditionalSeriesField({ control, watch }: Props) {
  const { t } = useTranslation();

  const getItem = () => {
    const id = new Date().getTime().toString();
    const item: TAdditionalSeriesItem = {
      id,
      name_key: '',
      color_key: '',
    };
    return item;
  };

  const renderTabName = (field: TAdditionalSeriesItem, index: number) => {
    return index + 1;
  };

  return (
    <>
      <Alert icon={<IconInfoCircle size={16} />} title={t('viz.radar_chart.additional_series.label')}>
        <Trans i18nKey="viz.radar_chart.additional_series.intro">
          By setting <Mark>Series Name Key</Mark>, you may add series from more queries to the chart.
        </Trans>
      </Alert>
      <FieldArrayTabs<IRadarChartConf, TAdditionalSeriesItem>
        control={control}
        watch={watch}
        name="additional_series"
        getItem={getItem}
        addButtonText={t('viz.radar_chart.additional_series.add')}
        deleteButtonText={t('viz.radar_chart.additional_series.delete')}
        renderTabName={renderTabName}
      >
        {({ field, index }) => <AdditionalSeriesItemField control={control} index={index} />}
      </FieldArrayTabs>
    </>
  );
}
