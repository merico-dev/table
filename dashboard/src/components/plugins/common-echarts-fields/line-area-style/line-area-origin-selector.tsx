import { Box, ComboboxItem, Select, SelectProps, Stack, Text } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EchartsLineAreaStyle } from './types';
import { getSelectChangeHandler } from '~/utils/mantine';

type CustomItem = ComboboxItem & {
  label: string;
  description: string;
  value: string;
};

export const OriginSelectorItem: SelectProps['renderOption'] = ({ option, ...others }) => {
  const { label, description } = option as CustomItem;
  return (
    <Box {...others}>
      <Stack gap="0">
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
      </Stack>
    </Box>
  );
};

type Props = {
  value: EchartsLineAreaStyle['origin'];
  onChange: (v: EchartsLineAreaStyle['origin']) => void;
};
export const LineAreaOriginSelector = forwardRef<HTMLInputElement, Props>(({ value, onChange }, ref) => {
  const { t, i18n } = useTranslation();
  const options = useMemo(() => {
    return [
      {
        label: t('chart.series.line.area_style.origin.auto.label'),
        description: t('chart.series.line.area_style.origin.auto.description'),
        value: 'auto',
      },
      {
        label: t('chart.series.line.area_style.origin.start.label'),
        description: t('chart.series.line.area_style.origin.start.description'),
        value: 'start',
      },
      {
        label: t('chart.series.line.area_style.origin.end.label'),
        description: t('chart.series.line.area_style.origin.end.description'),
        value: 'end',
      },
    ];
  }, [i18n.language]);
  return (
    <Select
      ref={ref}
      label={t('chart.series.line.area_style.origin.label')}
      data={options}
      value={value}
      onChange={getSelectChangeHandler(onChange)}
      renderOption={OriginSelectorItem}
      size="xs"
    />
  );
});
