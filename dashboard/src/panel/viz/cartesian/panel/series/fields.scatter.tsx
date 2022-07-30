import { Group, Slider, Stack, Text } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';

const symbolSizeOptions = Array.from(new Array(9), (_, i) => ({
  label: String(i + 1),
  value: i + 1,
}))

interface IScatterFields {
  control: Control<ICartesianChartConf, any>;
  index: number;
}

export function ScatterFields({ control, index }: IScatterFields) {
  return (
    <Group direction="row" grow align="center">
      <Controller
        name={`series.${index}.symbolSize`}
        control={control}
        render={(({ field }) => (
          <Stack sx={{ flexGrow: 1 }} pb={16} spacing={4}>
            <Text size="sm">Size</Text>
            <Slider min={1} max={10} marks={symbolSizeOptions} {...field} sx={{ width: '100%' }} />
          </Stack>
        ))}
      />
    </Group>
  )
}