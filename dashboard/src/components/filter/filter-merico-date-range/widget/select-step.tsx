import { Select } from '@mantine/core';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MericoDateRangeValue } from '~/model';
import classes from './index.module.css';

type Props = {
  label: ReactNode | null;
  value: MericoDateRangeValue['step'];
  onChange: (v: MericoDateRangeValue['step']) => void;
  className?: string;
};

export const SelectStep = ({ label, value, onChange, className }: Props) => {
  const { t, i18n } = useTranslation();
  const options = useMemo(() => {
    return [
      {
        label: t('filter.widget.date_range.step.day'),
        value: 'day',
      },
      {
        label: t('filter.widget.date_range.step.week'),
        value: 'week',
      },
      {
        label: t('filter.widget.date_range.step.bi_week'),
        value: 'bi-week',
      },
      {
        label: t('filter.widget.date_range.step.month'),
        value: 'month',
      },
      {
        label: t('filter.widget.date_range.step.quarter'),
        value: 'quarter',
      },
    ];
  }, [t]);

  const handleChange = (step: string | null) => {
    if (!step) {
      return;
    }

    onChange(step);
  };

  return <Select className={className} label={label} data={options} value={value} onChange={handleChange} />;
};
