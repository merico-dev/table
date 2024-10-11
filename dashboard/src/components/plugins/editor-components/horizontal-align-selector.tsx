import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type HorizontalAlign = 'left' | 'center' | 'right';

interface Props {
  label?: string;
  value?: HorizontalAlign;
  onChange: (v: HorizontalAlign) => void;
  sx?: EmotionSx;
}

export const HorizontalAlignSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('common.align.horizontal.left'), value: 'left' },
        { label: t('common.align.horizontal.center'), value: 'center' },
        { label: t('common.align.horizontal.right'), value: 'right' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('common.align.horizontal.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
