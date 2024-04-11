import { MantineSize, MANTINE_SIZES, Select, Sx } from '@mantine/core';
import { Ref, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  label: string;
  value: MantineSize;
  onChange: (v: MantineSize) => void;
  sx?: Sx;
  disabled?: boolean;
}

export const MantineSizeSelector = forwardRef(
  ({ label, value, onChange, sx, disabled }: Props, ref: Ref<HTMLInputElement>) => {
    const { t } = useTranslation();
    const options = useMemo(() => {
      return MANTINE_SIZES.map((size) => ({
        label: t(`style.size.${size}`),
        value: size,
      }));
    }, []);

    return <Select ref={ref} data={options} label={label} value={value} onChange={onChange} sx={sx} disabled />;
  },
);
