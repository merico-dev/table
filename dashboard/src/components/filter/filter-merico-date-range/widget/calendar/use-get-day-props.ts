import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';

function getStartOf(date: Date | null, step: string) {
  if (!date) {
    return null;
  }
  const d = dayjs(date);
  switch (step) {
    case 'day':
    case 'week':
    case 'month':
    case 'quarter':
      return d.startOf(step);
    case 'bi-week':
      return d.startOf('week').subtract(1, 'week'); // [last week, current week]
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
      return d.endOf(step);
    case 'bi-week':
      return d.endOf('week'); // [last week, current week]
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

function getIsInRange(calendarDate: Date, basisDate: Date | null, selected: DateRangeValue_Value, step: string) {
  if (!basisDate) {
    return false;
  }
  const [s] = selected;
  // hover week
  const start = getStartOf(basisDate, step);
  const end = getEndOf(basisDate, step);
  const beforeHoverEnd = dayjs(calendarDate).isBefore(end);
  if (!s) {
    const afterHoverStart = dayjs(calendarDate).isAfter(start);
    return afterHoverStart && beforeHoverEnd;
  }
  const afterSelectedStart = dayjs(calendarDate).isAfter(s);
  return afterSelectedStart && beforeHoverEnd;
}

function getIsStart(d: Dayjs, hoverStart: Dayjs | null, selected: DateRangeValue_Value) {
  if (!hoverStart) {
    return false;
  }

  const [s] = selected;
  if (!s) {
    return d.isSame(hoverStart, 'day');
  }
  return d.isSame(s, 'day');
}

function getIsEnd(d: Dayjs, hoverEnd: Dayjs | null) {
  if (!hoverEnd) {
    return false;
  }

  return d.isSame(hoverEnd, 'day');
}

type HandleCalendarChange = (value: MericoDateRangeValue['value']) => void;

export const useGetDayProps = (value: MericoDateRangeValue, handleChange: HandleCalendarChange, readonly: boolean) => {
  const step = value.step;
  const [hovered, setHovered] = useState<Date | null>(null);
  const [selected, setSelected] = useState<DateRangeValue_Value>([null, null]);

  const handleClick = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start || !end) {
      return;
    }

    const [currentStart, currentEnd] = selected;
    const s = start.toDate();
    const e = end.toDate();
    if (currentStart === null) {
      setSelected([s, e]);
      return;
    }
    const isStartBeforeCurrentStart = s.getTime() < currentStart.getTime();
    const newValue: DateRangeValue_Value = isStartBeforeCurrentStart ? [s, currentEnd] : [currentStart, e];
    setSelected(newValue);
    handleChange(newValue);
  };

  useEffect(() => {
    setSelected([null, null]);
  }, [value]);

  const getDayProps = useCallback(
    (date: Date) => {
      const d = dayjs(date);
      if (readonly) {
        // show previous selection without hovering any date
        const [s, e] = value.value;
        if (!s || !e) {
          return {
            inRange: false,
            firstInRange: false,
            lastInRange: false,
            selected: false,
          };
        }
        const firstInRange = d.isSame(s, 'day');
        const lastInRange = d.isSame(e, 'day');
        const inRange = d.isBetween(s, e, 'day', '[]');
        return {
          inRange,
          firstInRange,
          lastInRange,
          selected: firstInRange || lastInRange,
        };
      }

      // TODO: not working when picked one and hover on a previous date
      const isHovered = getIsInRange(date, hovered, selected, step);
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
      const isStart = getIsStart(d, start, selected);
      const isEnd = getIsEnd(d, end);
      const isInRange = isHovered || isStart || isEnd;

      return {
        onMouseEnter: () => setHovered(date),
        onMouseLeave: () => setHovered(null),
        inRange: isInRange,
        firstInRange: isInRange && isStart,
        lastInRange: isInRange && isEnd,
        selected: isStart || isEnd,
        onClick: () => handleClick(start, end),
      };
    },
    [hovered, handleChange, step, readonly],
  );
  return {
    getDayProps,
  };
};
