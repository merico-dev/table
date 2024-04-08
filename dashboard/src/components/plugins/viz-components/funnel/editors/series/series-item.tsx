import { Box, Checkbox, Divider, Group, NumberInput, Select, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { LabelOverflowField } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import {
  LabelPositionOptionType,
  LabelPositionSelector,
} from '~/components/plugins/common-echarts-fields/label-position';
import { ChartingOrientation, OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';
import { IFunnelConf, IFunnelSeriesItem } from '../../type';
import { NameTextAlignSelector } from '~/components/plugins/common-echarts-fields/name-text-align';

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

interface ISeriesItemField {
  item: IFunnelSeriesItem;
  control: Control<IFunnelConf, $TSFixMe>;
  index: number;
  remove: (index: number) => void;
}

export const SeriesItemField = ({ item, control, index, remove }: ISeriesItemField) => {
  const { t, i18n } = useTranslation();
  const enable_min = item.min.enable_value;
  const enable_max = item.max.enable_value;
  const { orient } = item;

  const positionOptions: Record<ChartingOrientation, LabelPositionOptionType[]> = useMemo(
    () => ({
      horizontal: [
        { label: t('chart.label_position.top'), value: 'top' },
        { label: t('chart.label_position.inside_center'), value: 'inside' },
        { label: t('chart.label_position.bottom'), value: 'bottom' },
      ],
      vertical: [
        { label: t('chart.label_position.left'), value: 'left' },
        { label: t('chart.label_position.inside_left'), value: 'insideLeft' },
        { label: t('chart.label_position.inside_center'), value: 'inside' },
        { label: t('chart.label_position.inside_right'), value: 'insideRight' },
        { label: t('chart.label_position.right'), value: 'right' },
      ],
    }),
    [i18n.language],
  );

  const sortOptions = useMemo(
    () => [
      { label: t('viz.funnel_chart.sort.ascending'), value: 'ascending' },
      { label: t('viz.funnel_chart.sort.descending'), value: 'descending' },
      { label: t('viz.funnel_chart.sort.none'), value: '0' },
    ],
    [i18n.language],
  );

  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label={t('viz.funnel_chart.series_name')} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.level_name_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label={t('viz.funnel_chart.level_name_field')} {...field} />}
        />
        <Controller
          name={`series.${index}.level_value_data_key`}
          control={control}
          render={({ field }) => <DataFieldSelector label={t('viz.funnel_chart.level_value_field')} {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label={t('viz.funnel_chart.funnel_style')} labelPosition="center" />
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
                  <Text>{t('viz.funnel_chart.min_value')}</Text>
                  <Tooltip label={t('viz.funnel_chart.min_value_checkbox_tip')}>
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
          render={({ field }) => <TextInput placeholder="0%" label={t('viz.funnel_chart.min_size')} {...field} />}
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
                  <Text>{t('viz.funnel_chart.max_value')}</Text>
                  <Tooltip label={t('viz.funnel_chart.max_value_checkbox_tip')}>
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
          render={({ field }) => <TextInput placeholder="100%" label={t('viz.funnel_chart.max_size')} {...field} />}
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
          render={({ field }) => <Select label={t('viz.funnel_chart.sort.label')} data={sortOptions} {...field} />}
        />
      </Group>
      <Group grow noWrap>
        <Controller
          name={`series.${index}.funnelAlign`}
          control={control}
          render={({ field }) => (
            <NameTextAlignSelector label={t('viz.funnel_chart.align')} disabled={orient === 'horizontal'} {...field} />
          )}
        />
        <Controller
          name={`series.${index}.gap`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <NumberInput placeholder="0, 5, 10..." label={t('viz.funnel_chart.gap')} {...field} />}
        />
      </Group>

      <Divider mb={-10} mt={10} variant="dashed" label={t('chart.label.label_style')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`series.${index}.axisLabel.position`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error type error about undefined
            <LabelPositionSelector
              label={t('chart.label_position.label')}
              options={positionOptions[orient]}
              {...field}
            />
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
