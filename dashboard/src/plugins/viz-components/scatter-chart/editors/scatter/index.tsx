import { Divider, Group, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { SeriesColorSelect } from '~/plugins/viz-components/scatter-chart/editors/scatter/series-color-select';
import { IScatterChartConf } from '../../type';
import { ScatterLabelOverflowField } from './label-overflow';
import { ScatterSizeSelect } from './scatter-size-select';

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

interface IScatterField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
}
export function ScatterField({ control, watch }: IScatterField) {
  watch(['scatter']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="scatter.name_data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Name Data Field" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name="scatter.y_data_key"
          control={control}
          render={({ field }) => <DataFieldSelector label="Value Data Field" required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Divider mb={-15} label="Style" labelPosition="center" />
      <Controller
        name={`scatter.symbolSize`}
        control={control}
        render={({ field }) => <ScatterSizeSelect label="Size" {...field} />}
      />
      <Controller name={`scatter.color`} control={control} render={({ field }) => <SeriesColorSelect {...field} />} />
      <Divider mb={-15} label="Label" labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`scatter.label_position`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label="Label Position" data={labelPositions} {...field} />}
        />
      </Group>
      <Controller
        name={`scatter.label_overflow`}
        control={control}
        render={({ field }) => <ScatterLabelOverflowField {...field} />}
      />
    </Stack>
  );
}
