import { ActionIcon, Tabs } from '@mantine/core';
import React from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ICartesianChartConf } from '../../type';
import { RegressionField } from './regression-item';

interface IRegressionsField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function RegressionsField({ control, watch }: IRegressionsField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'regressions',
  });

  const watchFieldArray = watch('regressions');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const yAxes = watch('y_axes');
  const yAxisOptions = React.useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  const add = () =>
    append({
      transform: {
        type: 'ecStat:regression',
        config: {
          method: 'linear',
          order: 1,
          formulaOn: 'end',
        },
      },
      group_by_key: '',
      name: '',
      y_axis_data_key: '',
      plot: {
        type: 'line',
        yAxisIndex: 0,
        color: '#666666',
        lineStyle: {
          type: 'solid',
          width: 1,
        },
      },
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
          paddingTop: '6px',
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
        <Tabs.Tab onClick={add} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((regressionItem, index) => (
        <Tabs.Panel key={regressionItem.id} value={index.toString()}>
          <RegressionField
            regressionItem={regressionItem}
            control={control}
            index={index}
            remove={remove}
            yAxisOptions={yAxisOptions}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
