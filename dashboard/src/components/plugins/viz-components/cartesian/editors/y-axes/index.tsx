import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayButtonStateFunc, FieldArrayTabs } from '~/components/plugins/editor-components';
import { defaultNumberFormat } from '~/utils';
import { ICartesianChartConf, IYAxisConf } from '../../type';
import { YAxisField } from './y-axis';

interface IYAxesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item: IYAxisConf = {
      name: '',
      position: 'left',
      nameAlignment: 'left',
      label_formatter: defaultNumberFormat,
      min: '',
      max: '',
      show: true,
      mirror: false,
    };
    return item;
  };

  const renderTabName = (field: IYAxisConf, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  const deleteDisalbed: FieldArrayButtonStateFunc<IYAxisConf> = ({ field, index, fields }) => {
    return fields.length <= 1;
  };

  return (
    <FieldArrayTabs<ICartesianChartConf, IYAxisConf>
      control={control}
      watch={watch}
      name="y_axes"
      getItem={getItem}
      addButtonText={t('chart.y_axis.add')}
      deleteButtonText={t('chart.y_axis.delete')}
      renderTabName={renderTabName}
      deleteDisalbed={deleteDisalbed}
    >
      {({ field, index }) => <YAxisField control={control} index={index} />}
    </FieldArrayTabs>
  );
}
