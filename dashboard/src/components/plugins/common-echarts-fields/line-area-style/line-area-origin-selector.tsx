import { Box, Select, Stack, Text } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EchartsLineAreaStyle } from './types';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
  value: string;
}

export const OriginSelectorItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => {
    return (
      <Box {...others}>
        <Stack spacing="0" ref={ref}>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </Stack>
      </Box>
    );
  },
);

type Props = {
  value: EchartsLineAreaStyle['origin'];
  onChange: (v: EchartsLineAreaStyle['origin']) => void;
};
export const LineAreaOriginSelector = forwardRef(({ value, onChange }: Props) => {
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
      label={t('chart.series.line.area_style.origin.label')}
      data={options}
      value={value}
      onChange={onChange}
      itemComponent={OriginSelectorItem}
      size="xs"
    />
  );
});
