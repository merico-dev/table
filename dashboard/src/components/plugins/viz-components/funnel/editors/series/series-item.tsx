import { Box, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import {
  LabelPositionOptionType,
  LabelPositionSelector,
} from '~/components/plugins/common-echarts-fields/label-position';
import { AnyObject } from '~/types';
import { IFunnelConf, IFunnelSeriesItem } from '../../type';
import { ChartingOrientation, OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';

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

const positionOptions: Record<ChartingOrientation, LabelPositionOptionType[]> = {
  horizontal: [
    { label: 'Top', value: 'top' },
    { label: 'Inside Center', value: 'inside' },
    { label: 'Bottom', value: 'bottom' },
  ],
  vertical: [
    { label: 'Left', value: 'left' },
    { label: 'Inside Left', value: 'insideLeft' },
    { label: 'Inside Center', value: 'inside' },
    { label: 'Inside Right', value: 'insideRight' },
    { label: 'Right', value: 'right' },
  ],
};

interface ISeriesItemField {
  item: IFunnelSeriesItem;
  control: Control<IFunnelConf, $TSFixMe>;
  index: number;
  remove: (index: number) => void;
}

export const SeriesItemField = ({ item, control, index, remove }: ISeriesItemField) => {
  const enable_min = item.min.enable_value;
  const enable_max = item.max.enable_value;
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
          render={({ field }) => <DataFieldSelector label="Level Name Field" {...field} />}
        />
        <Controller
          name={`series.${index}.level_value_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label="Level Value Field" {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label="Funnel Style" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`series.${index}.min.value`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput
              disabled={!enable_min}
              labelProps={{ display: 'block' }}
              label={
                <Group position="apart" pr={6} sx={{ width: '100%' }}>
                  <Text>Min Value</Text>
                  <Tooltip label="Check to enable specific min value">
                    <Box>
                      <Controller
                        name={`series.${index}.min.enable_value`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            size="xs"
                            checked={field.value}
                            onChange={(event) => field.onChange(event.currentTarget.checked)}
                          />
                        )}
                      />
                    </Box>
                  </Tooltip>
                </Group>
              }
              {...field}
            />
          )}
        />
        <Controller
          name={`series.${index}.min.size`}
          control={control}
          render={({ field }) => <TextInput placeholder="0%" label="Min Size" {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.max.value`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <NumberInput
              disabled={!enable_max}
              labelProps={{ display: 'block' }}
              label={
                <Group position="apart" pr={6} sx={{ width: '100%' }}>
                  <Text>Max Value</Text>
                  <Tooltip label="Check to enable specific max value">
                    <Box>
                      <Controller
                        name={`series.${index}.max.enable_value`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            size="xs"
                            checked={field.value}
                            onChange={(event) => field.onChange(event.currentTarget.checked)}
                          />
                        )}
                      />
                    </Box>
                  </Tooltip>
                </Group>
              }
              {...field}
            />
          )}
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
          render={({ field }) => <OrientationSelector {...field} />}
        />
        <Controller
          name={`series.${index}.sort`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Sort" data={sortOptions} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.funnelAlign`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type of onChange
            <Select label="Align" disabled={orient === 'horizontal'} data={alignmentOptions} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.gap`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput placeholder="0, 5, 10..." label="Gap" {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label="Label Style" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`series.${index}.axisLabel.position`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type error about undefined
            <LabelPositionSelector label="Position" options={positionOptions[orient]} {...field} />
          )}
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
