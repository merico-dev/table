import { Button, Group, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { IBoxplotChartConf, IBoxplotReferenceLine } from '../../type';
import { ReferenceLineField } from './reference-line';
import { ITemplateVariable } from '~/utils';
import { useTranslation } from 'react-i18next';
import { FieldArrayTabs } from '~/components/plugins/editor-components';

interface IReferenceLinesField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceLinesField({ control, watch, variables }: IReferenceLinesField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item: IBoxplotReferenceLine = {
      name: '',
      template: '',
      variable_key: '',
    };
    return item;
  };
  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  const renderTabName = (field: IBoxplotReferenceLine, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };
  return (
    <FieldArrayTabs<IBoxplotChartConf, IBoxplotReferenceLine>
      control={control}
      watch={watch}
      name="reference_lines"
      getItem={getItem}
      addButtonText={t('chart.reference_line.add')}
      deleteButtonText={t('chart.reference_line.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => <ReferenceLineField control={control} index={index} variableOptions={variableOptions} />}
    </FieldArrayTabs>
  );
}
