import { ActionIcon, Tabs } from '@mantine/core';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { defaultNumberFormat } from '~/utils';
import { IScatterChartConf } from '../../type';
import { YAxisField } from './y-axis';

interface IYAxesField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function YAxesField({ control, watch }: IYAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'y_axes',
  });

  const watchFieldArray = watch('y_axes');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addYAxis = () =>
    append({
      name: '',
      label_formatter: defaultNumberFormat,
      min: '',
      max: '',
      show: true,
      position: 'right',
      nameAlignment: 'right',
    });

  return (
    <Tabs
      defaultValue="0"
      styles={{
        tab: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        panel: {
          padding: '0px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={field.id} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addYAxis} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={index.toString()}>
          <YAxisField control={control} index={index} remove={remove} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
