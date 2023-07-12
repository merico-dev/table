import { ActionIcon, Tabs } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';
import { ReferenceAreaField } from './reference-area';
import { ITemplateVariable } from '~/utils/template';

interface IReferenceAreasField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceAreasField({ control, watch, variables }: IReferenceAreasField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reference_areas',
  });

  const watchFieldArray = watch('reference_areas');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () =>
    append({
      name: '',
      color: 'rgba(0,0,0,0.1)',
      type: 'rectangle',
      direction: 'horizontal',
      y_keys: {
        upper: '',
        lower: '',
      },
    });

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);
  return (
    <Tabs
      defaultValue="0"
      styles={{
        tab: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        panel: {
          padding: '6px 0px 0px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={index} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={add} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={index} value={index.toString()}>
          <ReferenceAreaField control={control} index={index} remove={remove} variableOptions={variableOptions} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
