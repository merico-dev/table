import { Button, Group, Stack } from '@mantine/core';
import React from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';
import { RegressionField } from './regression-item';

interface IRegressionsField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
  data: $TSFixMe[];
}
export function RegressionsField({ control, watch, data }: IRegressionsField) {
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
    <Stack>
      {controlledFields.map((regressionItem, index) => (
        <RegressionField
          key={index}
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
