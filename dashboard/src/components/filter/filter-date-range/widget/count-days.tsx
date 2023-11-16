import { Badge, Tooltip } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const CountDays = ({ begin, end }: { begin: DateValue; end: DateValue }) => {
  const count = useMemo(() => {
    return dayjs(end).diff(dayjs(begin), 'days') + 1;
  }, [begin, end]);

  if (Number.isNaN(count)) {
    return <span style={{ userSelect: 'none', opacity: 0, visibility: 'hidden' }}>.</span>;
  }

  const postfix = count === 1 ? 'day' : 'days';
  return (
    <Tooltip label={`${count}${postfix}`}>
      <Badge size="sm">{count}</Badge>
    </Tooltip>
  );
};
