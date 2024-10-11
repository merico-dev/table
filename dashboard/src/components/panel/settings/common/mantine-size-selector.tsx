import { MantineSize, Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { Ref, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const MANTINE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
interface Props {
  label: string;
  value: MantineSize;
  onChange: (v: MantineSize) => void;
  sx?: EmotionSx;
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
