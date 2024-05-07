import { ActionIcon, Tabs } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ICartesianChartConf, ICartesianReferenceArea } from '../../type';
import { ReferenceAreaField } from './reference-area';
import { ITemplateVariable } from '~/utils';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { useTranslation } from 'react-i18next';

interface IReferenceAreasField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceAreasField({ control, watch, variables }: IReferenceAreasField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item: ICartesianReferenceArea = {
      name: '',
      color: 'rgba(0,0,0,0.1)',
      type: 'rectangle',
      direction: 'horizontal',
      y_keys: {
        upper: '',
        lower: '',
      },
    };
    return item;
  };

  const renderTabName = (field: ICartesianReferenceArea, index: number) => {
    const n = field.name.trim();
    return n ? n : index + 1;
  };

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  return (
    <FieldArrayTabs<ICartesianChartConf, ICartesianReferenceArea>
      control={control}
      watch={watch}
      name="reference_areas"
      getItem={getItem}
      addButtonText={t('chart.reference_area.add')}
      deleteButtonText={t('chart.reference_area.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => <ReferenceAreaField control={control} index={index} variableOptions={variableOptions} />}
    </FieldArrayTabs>
  );
}
