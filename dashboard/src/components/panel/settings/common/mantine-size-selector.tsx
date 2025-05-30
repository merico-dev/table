import { MantineSize, Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { Ref, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSelectChangeHandler } from '~/utils/mantine';

const MANTINE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  sx?: EmotionSx;
  disabled?: boolean;
}

export const MantineSizeSelector = forwardRef(
  ({ label, value, onChange, sx, disabled }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();
    const options = useMemo(() => {
      return MANTINE_SIZES.map((size) => ({
        label: t(`style.size.${size}`),
        value: size,
      }));
    }, [i18n.language]);

    return (
      <Select
        ref={ref}
        data={options}
        label={label}
        value={value}
        onChange={getSelectChangeHandler<MantineSize>(onChange)}
        sx={sx}
        disabled
      />
    );
  },
);
