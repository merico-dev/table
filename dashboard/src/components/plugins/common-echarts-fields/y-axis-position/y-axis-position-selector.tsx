import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EChartsYAxisPosition } from './types';

interface Props {
  label?: string;
  value?: EChartsYAxisPosition;
  onChange: (v: EChartsYAxisPosition) => void;
  sx?: Sx;
}

export const YAxisPositionSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('chart.y_axis.position.left'), value: 'left' },
        { label: t('chart.y_axis.position.right'), value: 'right' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('chart.y_axis.position.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
