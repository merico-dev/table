import { Button, Checkbox, Divider, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { AggregationSelector } from '~/components/panel/settings/common/aggregation-selector';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { AnyObject } from '~/types';
import { DefaultAggregation } from '~/utils/aggregation';
import { IHorizontalBarChartConf, IHorizontalBarChartSeriesItem } from '../../type';
import { BarFields } from './fields.bar';

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
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  seriesItem: IHorizontalBarChartSeriesItem;
  xAxisOptions: {
    label: string;
    value: string;
  }[];
}

export function SeriesItemField({ control, index, remove, seriesItem, xAxisOptions }: ISeriesItemField) {
  return (
    <Stack key={index} my={0} p={0} sx={{ position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.xAxisIndex`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select
              label="X Axis"
              data={xAxisOptions}
              disabled={xAxisOptions.length === 0}
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`series.${index}.aggregation_on_value`}
          control={control}
          render={({ field }) => (
            <AggregationSelector
              label="Aggregation on Value"
              value={field.value ?? DefaultAggregation}
              onChange={field.onChange}
              pt={0}
            />
          )}
        />
      </Group>
      <Group grow>
        <Controller
          name={`series.${index}.group_by_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector
              label="Split into multiple series by this key..."
              clearable
              sx={{ flex: 1 }}
              {...field}
            />
          )}
        />
      </Group>
      <BarFields index={index} control={control} seriesItem={seriesItem} />
      <Divider mb={-10} mt={10} variant="dashed" label="Style" labelPosition="center" />
      <Controller
        name={`series.${index}.label_position`}
        control={control}
        // @ts-expect-error type of onChange
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
      <Controller
        name={`series.${index}.invisible`}
        control={control}
        render={({ field }) => (
          <Checkbox
            label="Invisible"
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
