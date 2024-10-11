import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartingOrientation } from './types';

interface Props {
  label?: string;
  value?: ChartingOrientation;
  onChange: (v: ChartingOrientation) => void;
  sx?: EmotionSx;
  disabled?: boolean;
}

export const OrientationSelector = forwardRef(
  ({ label, value, onChange, sx = {}, disabled }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(() => {
      const ret = [
        { label: t('chart.orientation.horizontal'), value: 'horizontal' },
        { label: t('chart.orientation.vertical'), value: 'vertical' },
      ];
      return ret;
    }, [i18n.language]);

    return (
      <Select
        ref={ref}
        label={label ?? t('chart.orientation.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
        disabled={disabled}
      />
    );
  },
);
