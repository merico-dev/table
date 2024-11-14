import { NumberInput, Text } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  label?: string;
  value?: number;
  onChange: (v: number) => void;
  sx?: EmotionSx;
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
          <Text size="xs" c="dimmed">
            {t('chart.degree')}
          </Text>
        }
        sx={sx}
        styles={{
          section: {
            width: '4em',
            justifyContent: 'flex-end',
            paddingRight: '6px',
          },
        }}
        value={value}
        onChange={(v: string | number) => {
          if (typeof v === 'string') {
            return;
          }
          onChange(v);
        }}
      />
    );
  },
);
