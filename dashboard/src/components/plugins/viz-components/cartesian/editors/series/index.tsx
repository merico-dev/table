import { randomId } from '@mantine/hooks';
import React from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { DEFAULT_SCATTER_SIZE } from '../../../../common-echarts-fields/symbol-size';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function SeriesField({ control, watch }: ISeriesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item: ICartesianChartSeriesItem = {
      type: 'bar',
      name: randomId(),
      showSymbol: false,
      symbolSize: DEFAULT_SCATTER_SIZE.static,
      y_axis_data_key: 'value',
      yAxisIndex: 0,
      label_position: 'top',
      display_name_on_line: false,
      stack: '',
      color: '#000',
      step: false,
      smooth: false,
      barMinWidth: '1',
      barWidth: '10%',
      barMaxWidth: '10',
      barGap: '0%',
      lineStyle: {
        type: 'solid',
        width: 1,
      },
      hide_in_legend: false,
      group_by_key: '',
    };
    return item;
  };

  const renderTabName = (field: ICartesianChartSeriesItem, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  const yAxes = watch('y_axes');

  const yAxisOptions = React.useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  return (
    <FieldArrayTabs<ICartesianChartConf, ICartesianChartSeriesItem>
      control={control}
      watch={watch}
      name="series"
      getItem={getItem}
      addButtonText={t('chart.series.add')}
      deleteButtonText={t('chart.series.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => (
        <SeriesItemField control={control} index={index} seriesItem={field} yAxisOptions={yAxisOptions} />
      )}
    </FieldArrayTabs>
  );
}
