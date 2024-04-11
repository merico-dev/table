import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignItems } from './type';

interface Props {
  label?: string;
  value?: AlignItems;
  onChange: (v: AlignItems) => void;
  sx?: Sx;
}

export const AlignItemsSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('style.flex.align_items.start'), value: 'start' },
        { label: t('style.flex.align_items.center'), value: 'center' },
        { label: t('style.flex.align_items.end'), value: 'end' },
        { label: t('style.flex.align_items.stretch'), value: 'stretch' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('style.flex.align_items.label')}
        data={options}
        value={value}
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
