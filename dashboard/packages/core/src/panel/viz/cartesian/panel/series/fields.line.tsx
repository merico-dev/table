import { Box, Group, Select, Switch } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';

const stepOptions = [
  { label: 'off', value: false },
  { label: 'start', value: 'start' },
  { label: 'middle', value: 'middle' },
  { label: 'end', value: 'end' },
]

interface ILineFields {
  control: Control<ICartesianChartConf, any>;
  index: number;
}

export function LineFields({ control, index }: ILineFields) {
  return (
    <Group direction="row" grow align="center">
      <Controller
        name={`series.${index}.step`}
        control={control}
        render={(({ field }) => (
          <Select
            label="Step"
            // @ts-ignore mixed type causes warning
            data={stepOptions}
            sx={{ flexGrow: 1, maxWidth: '48%' }}
            {...field}
          />
        ))}
      />
      <Controller
        name={`series.${index}.smooth`}
        control={control}
        render={(({ field }) => (
          <Box sx={{ flexGrow: 1 }}>
            <Switch
              label="Smooth Line"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          </Box>
        ))}
      />
    </Group>
  )
}