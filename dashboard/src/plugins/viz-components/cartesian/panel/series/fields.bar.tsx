import { Group, Select, TextInput } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf } from '../../type';

const barGapOptions = [
  {
    label: 'No gap between bars',
    value: '0%',
  },
  {
    label: 'Bars overlapping on each other',
    value: '-100%',
  },
];

interface IBarFields {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
}

export function BarFields({ control, index }: IBarFields) {
  return (
    <>
      <Group grow align="top">
        <Controller
          name={`series.${index}.stack`}
          control={control}
          render={({ field }) => (
            <TextInput label="Stack" placeholder="Stack bars by this ID" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.barWidth`}
          control={control}
          render={({ field }) => <TextInput label="Bar Width" sx={{ flexGrow: 1 }} {...field} />}
        />
      </Group>
      <Controller
        name={`series.${index}.barGap`}
        control={control}
        render={({ field }) => <Select label="Bar Gap" data={barGapOptions} sx={{ flexGrow: 1 }} {...field} />}
      />
    </>
  );
}
