import dayjs, { Dayjs } from 'dayjs';
import _ from 'lodash';
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

type Endpoints = {
  start: Dayjs | null;
  end: Dayjs | null;
};
function getEndpoints(hovered: Date | null, step: string): Endpoints | null {
  if (!hovered) {
    return null;
  }
  const start = getStartOf(hovered, step);
  const end = getEndOf(hovered, step);
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

function getPropsBySelection(d: Dayjs, selected: DateRangeValue_Value) {
  // show previous selection without hovering any date
  const [s, e] = selected;
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

function getPropsBySomething() {}

type HandleCalendarChange = (value: MericoDateRangeValue['value']) => void;

export const useGetDayProps = (value: MericoDateRangeValue, handleChange: HandleCalendarChange, readonly: boolean) => {
  const step = value.step;
  const [hovered, setHovered] = useState<Date | null>(null);
  const [selected, setSelected] = useState<DateRangeValue_Value>(value.value);

  const handleClick = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start || !end) {
      return;
    }

    const [currentStart, currentEnd] = selected;
    const s = start.toDate();
    const e = end.toDate();
    if (currentStart === null) {
      setSelected([s, null]);
      return;
    }
    const isStartBeforeCurrentStart = s.getTime() < currentStart.getTime();
    const newValue: DateRangeValue_Value = isStartBeforeCurrentStart ? [s, currentEnd] : [currentStart, e];
    setSelected(newValue);
    handleChange(newValue);
  };

  useEffect(() => {
    setSelected(value.value);
  }, [value]);

  useEffect(() => {
    setSelected([null, null]);
  }, [readonly]);

  const minDay = useMemo(() => {
    if (readonly) {
      return null;
    }
    if (selected[0]) {
      // during select
      return dayjs(selected[0]);
    }
    return null;
  }, [selected, readonly]);

  const maxDay = useMemo(() => {
    if (readonly) {
      return null;
    }
    if (selected[0]) {
      return dayjs(selected[0]).add(365, 'days');
    }
    return null;
  }, [selected, readonly]);

  const getReadonlyDayProps = useCallback(
    (date: Date) => {
      const d = dayjs(date);
      return getPropsBySelection(d, value.value);
    },
    [readonly, value.value],
  );
  const getDayProps = useCallback(
    (date: Date) => {
      const d = dayjs(date);
      const outofInterval = minDay && maxDay && (d.isBefore(minDay) || d.isAfter(maxDay));

      const basis = !hovered && selected[0] ? selected[0] : hovered;
      const endpoints = getEndpoints(basis, step);
      if (!endpoints) {
        return {
          onMouseEnter: () => setHovered(date),
          onMouseLeave: () => setHovered(null),
          inRange: false,
          firstInRange: false,
          lastInRange: false,
          selected: false,
          disabled: outofInterval,
        };
      }
      const print = d.format('MM-DD') === '06-04';

      if (outofInterval) {
        return {
          onMouseEnter: _.noop,
          onMouseLeave: _.noop,
          inRange: false,
          firstInRange: false,
          lastInRange: false,
          selected: false,
          disabled: true,
        };
      }

      const { start, end } = endpoints;
      const isStart = getIsStart(d, start, selected);
      const isEnd = getIsEnd(d, end);
      const inRange = getIsInRange(date, basis, selected, step);
      const firstInRange = inRange && isStart;
      const lastInRange = inRange && isEnd;
      const disabled = d.isBefore(minDay) || d.isAfter(maxDay);

      return {
        onMouseEnter: () => setHovered(date),
        onMouseLeave: () => setHovered(null),
        inRange,
        firstInRange,
        lastInRange,
        selected: isStart || isEnd,
        onClick: () => handleClick(start, end),
        disabled,
      };
    },
    [hovered, handleChange, step, readonly, minDay, maxDay, selected],
  );

  return {
    getDayProps: readonly ? getReadonlyDayProps : getDayProps,
  };
};
