import { Badge, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export const CountDays = ({ begin, end }: { begin: Date | null; end: Date | null }) => {
  const count = useMemo(() => {
    return dayjs(end).diff(dayjs(begin), 'days');
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
