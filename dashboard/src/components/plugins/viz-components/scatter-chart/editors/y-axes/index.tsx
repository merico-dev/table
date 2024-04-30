import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayButtonStateFunc, FieldArrayTabs } from '~/components/plugins/editor-components';
import { defaultNumberFormat } from '~/utils';
import { IYAxisConf } from '../../../cartesian/type';
import { IScatterChartConf } from '../../type';
import { YAxisField } from './y-axis';

interface IYAxesField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item: IYAxisConf = {
      name: '',
      label_formatter: defaultNumberFormat,
      min: '',
      max: '',
      show: true,
      position: 'right',
      nameAlignment: 'right',
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
    <FieldArrayTabs<IScatterChartConf, IYAxisConf>
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
