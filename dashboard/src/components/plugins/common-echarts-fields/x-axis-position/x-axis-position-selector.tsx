import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EChartsXAxisPosition } from './types';

interface Props {
  label?: string;
  value?: EChartsXAxisPosition;
  onChange: (v: EChartsXAxisPosition) => void;
  sx?: EmotionSx;
}

export const XAxisPositionSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('chart.x_axis.position.top'), value: 'top' },
        { label: t('chart.x_axis.position.bottom'), value: 'bottom' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('chart.x_axis.position.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
