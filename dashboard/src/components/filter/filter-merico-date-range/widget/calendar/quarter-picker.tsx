import { MonthPicker as MantineMonthPicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import classes from './quarter-picker.module.css';

type Props = {
  value: MericoDateRangeValue;
  handleRangeChange: (value: DateRangeValue_Value) => void;
};
export const QuarterPicker = ({ value, handleRangeChange }: Props) => {
  const v = value.value;
  const [begin, end] = v;

  const defaultDate = useMemo(() => {
    if (!begin) {
      return new Date();
    }
    return begin;
  }, [begin]);

  const minDate = useMemo(() => {
    if (begin && !end) {
      // during select
      return begin;
    }
    return undefined;
  }, [begin, end]);

  const maxDate = useMemo(() => {
    return dayjs(begin).add(365, 'days').subtract(1, 'second').toDate();
  }, [begin]);

  const endDay = useMemo(() => {
    if (!end) {
      return null;
    }
    return dayjs(end);
  }, [end]);

  const getMonthControlProps = useCallback(
    (date: Date) => {
      if (endDay) {
        const d = dayjs(date);
        const sameQuarter = d.isSame(endDay, 'quarter');
        if (sameQuarter) {
          return { lastInRange: true, selected: true };
        }
      }

      return {};
    },
    [endDay],
  );
  return (
    <MantineMonthPicker
      classNames={{
        calendarHeader: classes.calendar_header,
        monthsList: classes.months_list,
        monthsListRow: classes.months_list_row,
        monthsListControl: classes.months_list_control,
      }}
      defaultDate={defaultDate}
      numberOfColumns={2}
      type="range"
      value={v}
      onChange={handleRangeChange}
      minDate={minDate}
      maxDate={maxDate}
      allowSingleDateInRange
      maxLevel="year"
      monthsListFormat="Q"
      getMonthControlProps={getMonthControlProps}
    />
  );
};
