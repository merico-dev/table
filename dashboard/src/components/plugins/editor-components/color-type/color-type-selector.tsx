import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorType } from './type';

interface Props {
  label?: string;
  value?: ColorType;
  onChange: (v: ColorType) => void;
  sx?: Sx;
}

export const ColorTypeSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('style.color.type.static'), value: 'static' },
        { label: t('style.color.type.interpolation'), value: 'interpolation' },
        { label: t('style.color.type.none'), value: 'none' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('style.color.type.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
