import { Divider, Group, Select, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import { SymbolSizeSelector } from '~/components/plugins/common-echarts-fields/symbol-size';
import { SeriesColorSelect } from '~/components/plugins/viz-components/scatter-chart/editors/scatter/series-color-select';
import { IScatterChartConf } from '../../type';
import { ScatterLabelOverflowField } from './label-overflow';

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
  const { t } = useTranslation();
  watch(['scatter']);
  return (
    <Stack>
      <Group grow noWrap>
        <Controller
          name="scatter.name_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.name_data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name="scatter.y_data_key"
          control={control}
          render={({ field }) => (
            <DataFieldSelector label={t('common.value_data_field')} required sx={{ flex: 1 }} {...field} />
          )}
        />
      </Group>
      <Divider mb={-15} label={t('chart.style.label')} labelPosition="center" />
      <Controller
        name={`scatter.symbolSize`}
        control={control}
        render={({ field }) => <SymbolSizeSelector {...field} />}
      />
      <Controller name={`scatter.color`} control={control} render={({ field }) => <SeriesColorSelect {...field} />} />
      <Divider mb={-15} label={t('chart.label.label')} labelPosition="center" />
      <Group grow noWrap>
        <Controller
          name={`scatter.label_position`}
          control={control}
          // @ts-expect-error type of onChange
          render={({ field }) => <Select label={t('chart.label_position.label')} data={labelPositions} {...field} />}
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
