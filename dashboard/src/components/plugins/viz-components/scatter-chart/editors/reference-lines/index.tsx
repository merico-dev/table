import { random } from 'chroma-js';
import { useMemo } from 'react';
import { Control, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { ICartesianReferenceLine } from '~/components/plugins/viz-components/cartesian/type';
import { ITemplateVariable } from '~/utils';
import { IScatterChartConf } from '../../type';
import { ReferenceLineField } from './reference-line';

interface IReferenceLinesField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceLinesField({ control, watch, variables }: IReferenceLinesField) {
  const { t } = useTranslation();
  const getItem = () => {
    const item: ICartesianReferenceLine = {
      name: '',
      template: '',
      variable_key: '',
      orientation: 'horizontal',
      lineStyle: {
        type: 'dashed',
        width: 1,
        color: random().css(),
      },
      show_in_legend: false,
      yAxisIndex: 0,
    };
    return item;
  };

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  const yAxes = watch('y_axes');

  const yAxisOptions = useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  const renderTabName = (field: ICartesianReferenceLine, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };
  return (
    <FieldArrayTabs<IScatterChartConf, ICartesianReferenceLine>
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
          yAxisOptions={yAxisOptions}
        />
      )}
    </FieldArrayTabs>
  );
}
