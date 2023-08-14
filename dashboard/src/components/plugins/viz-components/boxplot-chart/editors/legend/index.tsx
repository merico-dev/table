import { Group, Select, Stack, Switch } from '@mantine/core';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { IBoxplotChartConf, TBoxplotLegend, TLegendOrientation } from '../../type';

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

interface Props {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  watch: UseFormWatch<IBoxplotChartConf>;
}
export const LegendField = ({ control, watch }: Props) => {
  const legend = watch('legend');
  const changeOrientation = (orient: TLegendOrientation, set: (v: TBoxplotLegend) => void) => {
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
              label="Show Legend"
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
            <Select
              label="Orientation"
              data={orientationOptions}
              sx={{ flex: 1 }}
              value={field.value.orient}
              onChange={(v: TLegendOrientation) => {
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
