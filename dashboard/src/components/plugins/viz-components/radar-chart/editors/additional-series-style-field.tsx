import { Divider, Group, NumberInput, Stack } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ColorPickerPopoverForViz } from '~/components/widgets';
import { LineTypeSelector } from '~/components/plugins/common-echarts-fields/line-type';
import { IRadarChartConf } from '../type';

type Props = {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
};

export function AdditionalSeriesStyleField({ control, index }: Props) {
  const { t } = useTranslation();
  const path = `additional_series.${index}.style` as const;

  return (
    <Stack gap="sm">
      <Divider variant="dashed" label={t('viz.radar_chart.style.series_style')} labelPosition="center" />
      <Controller
        name={`${path}.color` as const}
        control={control}
        render={({ field }) => <ColorPickerPopoverForViz label={t('chart.color.label')} {...field} />}
      />
      <Group grow>
        <Controller
          name={`${path}.lineStyle.type` as const}
          control={control}
          render={({ field }) => <LineTypeSelector sx={{ flexGrow: 1 }} {...field} />}
        />
        <Controller
          name={`${path}.lineStyle.width` as const}
          control={control}
          render={({ field }) => (
            <NumberInput label={t('chart.series.line.line_width')} min={1} max={10} sx={{ flexGrow: 1 }} {...field} />
          )}
        />
      </Group>
      <Controller
        name={`${path}.areaStyle.opacity` as const}
        control={control}
        render={({ field }) => (
          <NumberInput
            label={t('viz.radar_chart.style.area_opacity')}
            step={0.1}
            decimalScale={1}
            min={0}
            max={1}
            sx={{ flexGrow: 1 }}
            {...field}
          />
        )}
      />
    </Stack>
  );
}
