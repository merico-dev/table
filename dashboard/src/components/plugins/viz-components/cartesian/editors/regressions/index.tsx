import React from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { ICartesianChartConf, IRegressionConf } from '../../type';
import { RegressionField } from './regression-item';

interface IRegressionsField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function RegressionsField({ control, watch }: IRegressionsField) {
  const { t } = useTranslation();

  const yAxes = watch('y_axes');
  const yAxisOptions = React.useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  const getItem = () => {
    const item: IRegressionConf = {
      transform: {
        type: 'ecStat:regression',
        config: {
          method: 'linear',
          order: 1,
          formulaOn: 'end',
        },
      },
      group_by_key: '',
      name: '',
      y_axis_data_key: '',
      plot: {
        type: 'line',
        yAxisIndex: 0,
        color: '#666666',
        lineStyle: {
          type: 'solid',
          width: 1,
        },
      },
    };
    return item;
  };

  const renderTabName = (field: IRegressionConf, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  return (
    <FieldArrayTabs<ICartesianChartConf, IRegressionConf>
      control={control}
      watch={watch}
      name="regressions"
      getItem={getItem}
      addButtonText={t('chart.regression_line.add')}
      deleteButtonText={t('chart.regression_line.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => (
        <RegressionField regressionItem={field} control={control} index={index} yAxisOptions={yAxisOptions} />
      )}
    </FieldArrayTabs>
  );
}
