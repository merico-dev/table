import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { getNewXAxis, IHorizontalBarChartConf, IHorizontalBarChartXAxis } from '../../type';
import { XAxisField } from './x-axis';

interface IXAxesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
}
export function XAxesField({ control, watch }: IXAxesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item = getNewXAxis();
    return item;
  };

  const renderTabName = (field: IHorizontalBarChartXAxis, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  return (
    <FieldArrayTabs<IHorizontalBarChartConf, IHorizontalBarChartXAxis>
      control={control}
      watch={watch}
      name="x_axes"
      getItem={getItem}
      addButtonText={t('chart.x_axis.add')}
      deleteButtonText={t('chart.x_axis.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => <XAxisField control={control} index={index} />}
    </FieldArrayTabs>
  );
}
