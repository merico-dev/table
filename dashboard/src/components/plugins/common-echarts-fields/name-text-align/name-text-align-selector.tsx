import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EChartsNameTextAlign } from './types';
import { getSelectChangeHandler } from '~/utils/mantine';

interface Props {
  label?: string;
  value?: EChartsNameTextAlign;
  onChange: (v: EChartsNameTextAlign) => void;
  sx?: EmotionSx;
  disabled?: boolean;
}

export const NameTextAlignSelector = forwardRef(
  ({ label, value, onChange, sx = {}, disabled }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('chart.name_text.align.left'), value: 'left' },
        { label: t('chart.name_text.align.center'), value: 'center' },
        { label: t('chart.name_text.align.right'), value: 'right' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('chart.name_text.align.label')}
        data={options}
        value={value}
        onChange={getSelectChangeHandler(onChange)}
        sx={sx}
        disabled={disabled}
      />
    );
  },
);
