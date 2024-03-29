import { Group, Select, TextInput } from '@mantine/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';

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
  seriesItem: ICartesianChartSeriesItem;
}

export function BarFields({ control, index, seriesItem }: IBarFields) {
  const usingBarWidth = !!seriesItem.barWidth.trim();
  return (
    <>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.stack`}
          control={control}
          render={({ field }) => (
            <TextInput label="Stack" placeholder="Stack bars by this ID" sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.barGap`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Bar Gap" data={barGapOptions} sx={{ flexGrow: 1 }} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.barMinWidth`}
          control={control}
          render={({ field }) => (
            <TextInput label="Bar Width(Min)" disabled={usingBarWidth} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.barWidth`}
          control={control}
          render={({ field }) => <TextInput label="Bar Width" sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.barMaxWidth`}
          control={control}
          render={({ field }) => (
            <TextInput label="Bar Width(Max)" disabled={usingBarWidth} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
    </>
  );
}
