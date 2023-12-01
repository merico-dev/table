import { Tabs } from '@mantine/core';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ITemplateVariable } from '~/utils';
import { getNewReferenceLine, IHorizontalBarChartConf } from '../../type';
import { ReferenceLineField } from './reference-line';

interface IReferenceLinesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceLinesField({ control, watch, variables }: IReferenceLinesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reference_lines',
  });

  const watchFieldArray = watch('reference_lines');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => {
    const v = getNewReferenceLine();
    append(v);
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
        {controlledFields.map((field, index) => (
          <Tabs.Tab key={field.id} value={field.id}>
            {field.name}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={add} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={field.id}>
          <ReferenceLineField
            control={control}
            index={index}
            remove={remove}
            watch={watch}
            variableOptions={variableOptions}
            xAxisOptions={xAxisOptions}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
