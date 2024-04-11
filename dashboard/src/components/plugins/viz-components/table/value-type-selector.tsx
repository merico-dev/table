import { Select, Sx } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { ValueType } from './type';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

interface IValueTypeSelector {
  value: string;
  onChange: (value: ValueType) => void;
  sx?: Sx;
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
        onChange={onChange}
        sx={sx}
      />
    );
  },
);
