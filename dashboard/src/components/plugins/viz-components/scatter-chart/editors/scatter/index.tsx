import { Divider, Group, Stack } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataFieldSelector } from '~/components/panel/settings/common/data-field-selector';
import {
  IEchartsLabelPosition,
  LabelPositionSelector,
} from '~/components/plugins/common-echarts-fields/label-position';
import { SymbolSizeSelector } from '~/components/plugins/common-echarts-fields/symbol-size';
import { SeriesColorSelect } from '~/components/plugins/viz-components/scatter-chart/editors/scatter/series-color-select';
import { IScatterChartConf } from '../../type';
import { ScatterLabelOverflowField } from './label-overflow';

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
          render={({ field }) => (
            <LabelPositionSelector
              label={t('chart.label_position.label')}
              withOffOption
              {...field}
              onChange={(v?: IEchartsLabelPosition) => {
                v && field.onChange(v);
              }}
            />
          )}
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
