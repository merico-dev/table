import { Button, Group, Stack } from '@mantine/core';
import React from 'react';
import { Control, useFieldArray, UseFormGetValues, UseFormWatch } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { RegressionField } from './regression-item';

interface IRegressionsField {
  control: Control<ICartesianChartConf, any>;
  watch: UseFormWatch<ICartesianChartConf>;
  getValues: UseFormGetValues<ICartesianChartConf>;
  data: any[];
}
export function RegressionsField({ control, watch, getValues, data }: IRegressionsField) {
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

  const yAxisOptions = React.useMemo(() => {
    return getValues().y_axes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [getValues]);

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
      name: '',
      y_axis_data_key: '',
      plot: {
        type: 'line',
        yAxisIndex: 0,
        color: '#666666',
      },
    });

  return (
    <Stack>
      {controlledFields.map((regressionItem, index) => (
        <RegressionField
          regressionItem={regressionItem}
          control={control}
          index={index}
          remove={remove}
          yAxisOptions={yAxisOptions}
          data={data}
        />
      ))}
      <Group position="center" mt="xs">
        <Button onClick={add}>Add a Regression Line</Button>
      </Group>
    </Stack>
  );
}
