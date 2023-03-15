import { Tabs } from '@mantine/core';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { getNewXAxis, IHorizontalBarChartConf } from '../../type';
import { XAxisField } from './x-axis';

interface IXAxesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
}
export function XAxesField({ control, watch }: IXAxesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'x_axes',
  });

  const watchFieldArray = watch('x_axes');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addXAxis = () => {
    const v = getNewXAxis();
    append(v);
  };

  const defaultTab = controlledFields.length > 0 ? controlledFields[0].id : '0';
  return (
    <Tabs
      defaultValue={defaultTab}
      styles={{
        tab: {
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        panel: {
          padding: '0px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((field) => (
          <Tabs.Tab key={field.id} value={field.id}>
            {field.name}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addXAxis} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={field.id}>
          <XAxisField control={control} index={index} remove={remove} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
