import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { MericoDateRangeValue } from '~/model';

function getStartOf(date: Date | null, step: string) {
  const d = dayjs(date);
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
    case 'quarter':
      return d.startOf(step).toDate();
    case 'bi-week':
      return d.startOf('week').subtract(1, 'week').toDate(); // [last week, current week]
    default:
      throw new Error(`[merico-date-range] unexpected date-range step: ${step}`);
  }
}

function getEndOf(date: Date | null, step: string) {
  if (!date) {
    return null;
  }
  const d = dayjs(date);
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
    case 'quarter':
      return d.endOf(step).toDate();
    case 'bi-week':
      return d.endOf('week').toDate(); // [last week, current week]
    default:
      throw new Error(`[merico-date-range] unexpected date-range step: ${step}`);
  }
}

function getEndpoints(basisDate: Date | null, step: string) {
  if (!basisDate) {
    return null;
  }
  const start = getStartOf(basisDate, step);
  const end = getEndOf(basisDate, step);
  return { start, end };
}

function getIsInRange(calendarDate: Date, basisDate: Date | null, step: string) {
  if (!basisDate) {
    return false;
  }
  const start = getStartOf(basisDate, step);
  const end = getEndOf(basisDate, step);
  return dayjs(calendarDate).isBefore(end) && dayjs(calendarDate).isAfter(start);
}

type HandleCalendarChange = (value: MericoDateRangeValue['value']) => void;

export const useGetDayProps = (value: MericoDateRangeValue, handleChange: HandleCalendarChange) => {
  const step = value.step;
  const [hovered, setHovered] = useState<Date | null>(null);

  const getDayProps = useCallback(
    (date: Date) => {
      const isHovered = getIsInRange(date, hovered, step);
      const endpoints = getEndpoints(hovered, step);
      if (!endpoints) {
        return {
          onMouseEnter: () => setHovered(date),
          onMouseLeave: () => setHovered(null),
          inRange: false,
          firstInRange: false,
          lastInRange: false,
          selected: false,
        };
      }
      const { start, end } = endpoints;
      const isStart = dayjs(date).isSame(start, 'day');
      const isEnd = dayjs(date).isSame(end, 'day');
      const isInRange = isHovered || isStart || isEnd;

      return {
        onMouseEnter: () => setHovered(date),
        onMouseLeave: () => setHovered(null),
        inRange: isInRange,
        firstInRange: isInRange && isStart,
        lastInRange: isInRange && isEnd,
        selected: isStart || isEnd,
        onClick: () => handleChange([start, end]),
      };
    },
    [hovered, handleChange, step],
  );
  return {
    getDayProps,
  };
};
