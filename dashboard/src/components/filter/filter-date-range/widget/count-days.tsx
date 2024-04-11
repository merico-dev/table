import { Badge, Tooltip } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const CountDays = ({ begin, end }: { begin: DateValue; end: DateValue }) => {
  const { t } = useTranslation();
  const count = useMemo(() => {
    return dayjs(end).diff(dayjs(begin), 'days') + 1;
  }, [begin, end]);

  if (Number.isNaN(count)) {
    return <span style={{ userSelect: 'none', opacity: 0, visibility: 'hidden' }}>.</span>;
  }

  const label = count === 1 ? t('filter.widget.date_range.one_day') : t('filter.widget.date_range.x_days', { count });
  return (
    <Tooltip label={label}>
      <Badge size="sm">{count}</Badge>
    </Tooltip>
  );
};
