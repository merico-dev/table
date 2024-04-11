import { Text, Sx, NumberInput } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  label?: string;
  value?: number;
  onChange: (v: number) => void;
  sx?: Sx;
}

export const AxisLabelRotateInput = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t } = useTranslation();

    return (
      <NumberInput
        ref={ref}
        label={label ?? t('chart.rotate')}
        hideControls
        min={-90}
        max={90}
        rightSection={
          <Text size="xs" color="dimmed">
            {t('chart.degree')}
          </Text>
        }
        sx={sx}
        styles={{
          rightSection: {
            width: '4em',
            justifyContent: 'flex-end',
            paddingRight: '6px',
          },
        }}
        value={value}
        onChange={onChange}
      />
    );
  },
);
