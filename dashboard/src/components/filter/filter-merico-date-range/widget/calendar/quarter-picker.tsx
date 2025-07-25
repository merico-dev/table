import { MonthPicker as MantineMonthPicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';
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
    return dayjs().add(365, 'days').toDate();
  }, []);
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
    />
  );
};
