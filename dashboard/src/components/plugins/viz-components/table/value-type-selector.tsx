import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueType } from './type';
import { getSelectChangeHandler } from '~/utils/mantine';

interface IValueTypeSelector {
  value: string;
  onChange: (value: ValueType) => void;
  sx?: EmotionSx;
}

export const ValueTypeSelector = forwardRef(
  ({ value, onChange, sx }: IValueTypeSelector, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();
    const options = useMemo(() => {
      return Object.values(ValueType).map((v) => ({ label: t(`viz.table.column.value_type.${v}`), value: v }));
    }, [i18n.language]);

    return (
      <Select
        ref={ref}
        label={t('viz.table.column.value_type.label')}
        data={options}
        value={value}
        onChange={getSelectChangeHandler(onChange)}
        maxDropdownHeight={500}
        sx={sx}
      />
    );
  },
);
