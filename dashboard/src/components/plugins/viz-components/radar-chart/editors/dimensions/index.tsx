import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { defaultNumberFormat } from '~/utils';
import { IRadarChartConf, IRadarChartDimension } from '../../type';
import { DimensionField } from './dimension';

interface IDimensionsField {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
}

export function DimensionsField({ control, watch }: IDimensionsField) {
  const { t } = useTranslation();

  const getItem = () => {
    const id = new Date().getTime().toString();
    const item = {
      id,
      name: id,
      data_key: '',
      max: '100',
      formatter: defaultNumberFormat,
    };
    return item;
  };

  const renderTabName = (field: IRadarChartDimension, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  return (
    <>
      <FieldArrayTabs<IRadarChartConf, IRadarChartDimension>
        control={control}
        watch={watch}
        name="dimensions"
        getItem={getItem}
        addButtonText={t('viz.radar_chart.metric.add')}
        deleteButtonText={t('viz.radar_chart.metric.delete')}
        renderTabName={renderTabName}
      >
        {({ field, index }) => <DimensionField control={control} index={index} />}
      </FieldArrayTabs>
    </>
  );
}
