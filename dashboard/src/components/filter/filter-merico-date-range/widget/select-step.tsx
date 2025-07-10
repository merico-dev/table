import { Group, Select } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MericoDateRangeValue } from '~/model';
import classes from './index.module.css';

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: MericoDateRangeValue) => void;
};

export const SelectStep = ({ value, onChange }: Props) => {
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

    onChange({
      ...value,
      step,
    });
  };

  return (
    <Select
      className={classes.step}
      label={<Group justify="flex-end">&nbsp;</Group>}
      data={options}
      value={value.step}
      onChange={handleChange}
      w={100}
    />
  );
};
