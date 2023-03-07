import { Box, Checkbox, Divider, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Control, Controller } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { LabelPositionSelector } from '~/plugins/common-echarts-fields/label-position';
import { AnyObject } from '~/types';
import { IFunnelConf, IFunnelSeriesItem } from '../../type';

const sortOptions = [
  { label: 'Ascending', value: 'ascending' },
  { label: 'Descending', value: 'descending' },
  { label: 'Use original data order', value: '0' },
];

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

interface ISeriesItemField {
  item: IFunnelSeriesItem;
  control: Control<IFunnelConf, $TSFixMe>;
  data: AnyObject[];
  index: number;
  remove: (index: number) => void;
}

export const SeriesItemField = ({ item, control, data, index, remove }: ISeriesItemField) => {
  const use_data_min = item.min.use_data_min;
  const use_data_max = item.max.use_data_max;
  const { orient } = item;
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Series Name" {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.level_name_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Level Name Field" data={data} {...field} />}
        />
        <Controller
          name={`series.${index}.level_value_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Level Value Field" data={data} {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label="Funnel Style" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`series.${index}.min.use_data_min`}
          control={control}
          render={({ field }) => (
            <Checkbox
              mt={24}
              label="Use min value in data"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          )}
        />
        <Controller
          name={`series.${index}.min.value`}
          control={control}
          render={({ field }) => <NumberInput disabled={use_data_min} label="Min Value" {...field} />}
        />
        <Controller
          name={`series.${index}.min.size`}
          control={control}
          render={({ field }) => <TextInput placeholder="0%" label="Min Size" {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.max.use_data_max`}
          control={control}
          render={({ field }) => (
            <Checkbox
              mt={24}
              label="Use max value in data"
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
            />
          )}
        />
        <Controller
          name={`series.${index}.max.value`}
          control={control}
          render={({ field }) => <NumberInput disabled={use_data_max} label="Max Value" {...field} />}
        />
        <Controller
          name={`series.${index}.max.size`}
          control={control}
          render={({ field }) => <TextInput placeholder="100%" label="Max Size" {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.orient`}
          control={control}
          render={({ field }) => <Select label="Orientation" data={orientationOptions} {...field} />}
        />
        <Controller
          name={`series.${index}.sort`}
          control={control}
          render={({ field }) => <Select label="Sort" data={sortOptions} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.funnelAlign`}
          control={control}
          render={({ field }) => (
            <Select label="Align" disabled={orient === 'horizontal'} data={alignmentOptions} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.gap`}
          control={control}
          render={({ field }) => <NumberInput placeholder="0, 5, 10..." label="Gap" {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label="Label Style" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`series.${index}.axisLabel.position`}
          control={control}
          render={({ field }) => <LabelPositionSelector label="Position" {...field} />}
        />
        <Box />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.axisLabel.overflow`}
          control={control}
          render={({ field }) => <LabelOverflowField {...field} />}
        />
      </Group>

      {/* <Divider mb={-10} mt={10} variant="dashed" /> */}
      {/* <Button
        leftIcon={<Trash size={16} />}
        color="red"
        variant="light"
        onClick={() => remove(index)}
        disabled
        sx={{ top: 15, right: 5 }}
      >
        Delete this Series
      </Button> */}
    </Stack>
  );
};
