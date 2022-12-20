import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import React from 'react';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/panel/settings/common/mantine-color';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { BarFields } from './fields.bar';
import { LineFields } from './fields.line';
import { ScatterFields } from './fields.scatter';

const labelPositions = [
  { label: 'off', value: '' },
  { label: 'top', value: 'top' },
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
  { label: 'bottom', value: 'bottom' },
  { label: 'inside', value: 'inside' },
  { label: 'insideLeft', value: 'insideLeft' },
  { label: 'insideRight', value: 'insideRight' },
  { label: 'insideTop', value: 'insideTop' },
  { label: 'insideBottom', value: 'insideBottom' },
  { label: 'insideTopLeft', value: 'insideTopLeft' },
  { label: 'insideBottomLeft', value: 'insideBottomLeft' },
  { label: 'insideTopRight', value: 'insideTopRight' },
  { label: 'insideBottomRight', value: 'insideBottomRight' },
];

interface ISeriesItemField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  seriesItem: ICartesianChartSeriesItem;
  yAxisOptions: {
    label: string;
    value: string;
  }[];
  data: $TSFixMe[];
}

export function SeriesItemField({ control, index, remove, seriesItem, yAxisOptions, data }: ISeriesItemField) {
  const type = seriesItem.type;
  return (
    <Stack key={index} my={0} p={0} sx={{ position: 'relative' }}>
      <Stack>
        <Controller
          name={`series.${index}.type`}
          control={control}
          render={({ field }) => (
            <SegmentedControl
              data={[
                { label: 'Line', value: 'line' },
                { label: 'Bar', value: 'bar' },
                { label: 'Scatter', value: 'scatter' },
                { label: 'Boxplot', value: 'boxplot', disabled: true },
              ]}
              {...field}
            />
          )}
        />
      </Stack>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.y_axis_data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Value Field" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.yAxisIndex`}
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <Select
              label="Y Axis"
              data={yAxisOptions}
              disabled={yAxisOptions.length === 0}
              {...rest}
              value={value?.toString() ?? ''}
              onChange={(value: string | null) => {
                if (!value) {
                  onChange(0);
                  return;
                }
                onChange(Number(value));
              }}
              sx={{ flex: 1 }}
            />
          )}
        />
        <Controller
          name={`series.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Group By" data={data} clearable sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      {type === 'line' && <LineFields index={index} control={control} />}
      {type === 'bar' && <BarFields index={index} control={control} />}
      {type === 'scatter' && <ScatterFields index={index} control={control} data={data} />}
      <Divider mb={-10} mt={10} variant="dashed" label="Style" labelPosition="center" />
      <Controller
        name={`series.${index}.label_position`}
        control={control}
        render={({ field }) => <Select label="Label Position" data={labelPositions} {...field} />}
      />
      <Stack spacing={4}>
        <Text size="sm">Color</Text>
        <Controller
          name={`series.${index}.color`}
          control={control}
          render={({ field }) => <MantineColorSelector {...field} />}
        />
      </Stack>
      <Divider mb={-10} mt={10} variant="dashed" label="Behavior" labelPosition="center" />
      <Controller
        name={`series.${index}.hide_in_legend`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Hide in legend"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
      <Divider mb={-10} mt={10} variant="dashed" />
      <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        sx={{ top: 15, right: 5 }}
      >
        Delete this Series
      </Button>
    </Stack>
  );
}
