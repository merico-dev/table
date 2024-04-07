import { Group, Stack, Switch } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChartingOrientation, OrientationSelector } from '~/components/plugins/common-echarts-fields/orientation';
import { IBoxplotChartConf, TBoxplotLegend } from '../../type';

interface Props {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
}
export const LegendField = ({ control, watch }: Props) => {
  const { t } = useTranslation();
  const legend = watch('legend');
  const changeOrientation = (orient: ChartingOrientation, set: (v: TBoxplotLegend) => void) => {
    const ret: TBoxplotLegend = { ...legend, orient };
    if (orient === 'horizontal') {
      ret.top = '0';
      ret.left = 'auto';
      ret.right = '10';
      ret.bottom = 'auto';
    } else {
      ret.top = '10';
      ret.left = 'auto';
      ret.right = '0';
      ret.bottom = 'auto';
    }
    set(ret);
  };

  return (
    <Stack>
      <Group grow noWrap mt={20}>
        <Controller
          name="legend.show"
          control={control}
          render={({ field }) => (
            <Switch
              label={t('chart.legend.show_legend')}
              sx={{ flex: 1 }}
              checked={field.value}
              onChange={(e) => field.onChange(e.currentTarget.checked)}
            />
          )}
        />
      </Group>
      <Group>
        <Controller
          name="legend"
          control={control}
          render={({ field }) => (
            <OrientationSelector
              sx={{ flex: 1 }}
              value={field.value.orient}
              onChange={(v: ChartingOrientation) => {
                changeOrientation(v, field.onChange);
              }}
              disabled={!legend.show}
            />
          )}
        />
      </Group>
    </Stack>
  );
};
