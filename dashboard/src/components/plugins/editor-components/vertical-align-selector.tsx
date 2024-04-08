import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type VerticalAlign = 'top' | 'center' | 'bottom';

interface Props {
  label?: string;
  value?: VerticalAlign;
  onChange: (v: VerticalAlign) => void;
  sx?: Sx;
}

export const VerticalAlignSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('common.align.vertical.top'), value: 'top' },
        { label: t('common.align.vertical.center'), value: 'center' },
        { label: t('common.align.vertical.bottom'), value: 'bottom' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('common.align.vertical.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
