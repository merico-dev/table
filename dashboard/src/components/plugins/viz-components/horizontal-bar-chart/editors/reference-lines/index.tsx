import { useMemo } from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { ITemplateVariable } from '~/utils';
import { getNewReferenceLine, IHorizontalBarChartConf, IHorizontalBarChartReferenceLine } from '../../type';
import { ReferenceLineField } from './reference-line';

interface IReferenceLinesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceLinesField({ control, watch, variables }: IReferenceLinesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item = getNewReferenceLine();
    return item;
  };

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  const xAxes = watch('x_axes');

  const xAxisOptions = useMemo(() => {
    return xAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [xAxes]);

  const renderTabName = (field: IHorizontalBarChartReferenceLine, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };
  return (
    <FieldArrayTabs<IHorizontalBarChartConf, IHorizontalBarChartReferenceLine>
      control={control}
      watch={watch}
      name="reference_lines"
      getItem={getItem}
      addButtonText={t('chart.reference_line.add')}
      deleteButtonText={t('chart.reference_line.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => (
        <ReferenceLineField
          control={control}
          index={index}
          watch={watch}
          variableOptions={variableOptions}
          xAxisOptions={xAxisOptions}
        />
      )}
    </FieldArrayTabs>
  );
}
