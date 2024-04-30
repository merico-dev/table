import React from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { IHorizontalBarChartConf, IHorizontalBarChartSeriesItem, getNewSeriesItem } from '../../type';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
}
export function SeriesField({ control, watch }: ISeriesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item = getNewSeriesItem();
    return item;
  };

  const renderTabName = (field: IHorizontalBarChartSeriesItem, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  const xAxes = watch('x_axes');

  const xAxisOptions = React.useMemo(() => {
    return xAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [xAxes]);

  return (
    <FieldArrayTabs<IHorizontalBarChartConf, IHorizontalBarChartSeriesItem>
      control={control}
      watch={watch}
      name="series"
      getItem={getItem}
      addButtonText={t('chart.series.add')}
      deleteButtonText={t('chart.series.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => (
        <SeriesItemField control={control} index={index} seriesItem={field} xAxisOptions={xAxisOptions} />
      )}
    </FieldArrayTabs>
  );
}
