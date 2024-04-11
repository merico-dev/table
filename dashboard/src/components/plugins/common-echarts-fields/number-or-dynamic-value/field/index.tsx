import { Select, SimpleGrid } from '@mantine/core';
import { forwardRef, useMemo } from 'react';
import { DynamicValueField } from './dynamic';
import { StaticNumberField } from './static';
import { DEFAULT_VALUE, TNumberOrDynamic } from '../types';
import { useTranslation } from 'react-i18next';

interface IProps {
  label?: string;
  value: TNumberOrDynamic;
  onChange: (v: TNumberOrDynamic) => void;
}

export const NumberOrDynamicValue = forwardRef<HTMLInputElement, IProps>(
  ({ label = 'Value', value, onChange }: IProps, ref) => {
    const { t, i18n } = useTranslation();
    const changeType = (type: 'static' | 'dynamic') => {
      onChange({ ...DEFAULT_VALUE[type] });
    };
    const typeOptions = useMemo(
      () => [
        {
          label: t('chart.number_or_dynamic_value.type.static'),
          value: 'static',
        },
        {
          label: t('chart.number_or_dynamic_value.type.dynamic'),
          value: 'dynamic',
        },
      ],
      [i18n.language],
    );
    return (
      <SimpleGrid cols={2}>
        <Select
          ref={ref}
          label={label}
          data={typeOptions}
          value={value.type}
          onChange={changeType}
          sx={{ flexGrow: 1 }}
        />
        <StaticNumberField value={value} onChange={onChange} />
        <DynamicValueField value={value} onChange={onChange} />
      </SimpleGrid>
    );
  },
);
