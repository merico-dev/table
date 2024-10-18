import { Divider, Group, NumberInput, Stack, Switch, ThemeIcon } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LineAreaOriginSelector } from './line-area-origin-selector';
import { TempColorInput } from './temp-color-input';
import { EchartsLineAreaStyle } from './types';
import { IconChartAreaFilled, IconChartAreaLineFilled } from '@tabler/icons-react';

type Props = {
  value: EchartsLineAreaStyle;
  onChange: (v: EchartsLineAreaStyle) => void;
};

export const LineAreaStyleField = forwardRef(({ value, onChange }: Props, ref: any) => {
  const { t } = useTranslation();
  const getChangeHandler = (path: string) => (v: any) => {
    const newV = _.cloneDeep(value);
    _.set(newV, path, v);
    onChange(newV);
  };

  return (
    <Stack ref={ref}>
      <Divider
        mt={10}
        mb={-10}
        variant="dashed"
        label={
          <Group gap={6}>
            <IconChartAreaLineFilled size={14} style={{ color: '#999' }} />
            {t('chart.series.line.area_style.label')}
          </Group>
        }
        labelPosition="center"
      />
      <Switch
        label={t('chart.series.line.area_style.enabled')}
        checked={value.enabled}
        onChange={(e) => getChangeHandler('enabled')(e.currentTarget.checked)}
      />
      <Group grow>
        <TempColorInput
          label={t('chart.series.line.area_style.color')}
          placeholder={t('chart.series.line.area_style.use_series_color')}
          value={value.color}
          onChange={getChangeHandler('color')}
        />
        <NumberInput
          size="xs"
          label={t('chart.series.line.area_style.opacity')}
          value={value.opacity}
          onChange={getChangeHandler('opacity')}
          step={0.1}
          decimalScale={1}
          min={0}
          max={1}
        />
      </Group>
      <LineAreaOriginSelector value={value.origin} onChange={getChangeHandler('origin')} />
      <Group grow>
        <TempColorInput
          label={t('chart.series.line.area_style.shadow_color')}
          value={value.shadowColor}
          onChange={getChangeHandler('shadowColor')}
        />
        <NumberInput
          size="xs"
          label={t('chart.series.line.area_style.shadow_blur')}
          value={value.shadowBlur}
          onChange={getChangeHandler('shadowBlur')}
        />
      </Group>
      <Group grow>
        <NumberInput
          size="xs"
          label={t('chart.series.line.area_style.shadow_offset_x')}
          value={value.shadowOffsetX}
          onChange={getChangeHandler('shadowOffsetX')}
        />
        <NumberInput
          size="xs"
          label={t('chart.series.line.area_style.shadow_offset_y')}
          value={value.shadowOffsetY}
          onChange={getChangeHandler('shadowOffsetY')}
        />
      </Group>
    </Stack>
  );
});
