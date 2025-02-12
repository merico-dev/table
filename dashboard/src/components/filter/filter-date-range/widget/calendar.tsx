import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DateRangeValue, DateRangeValue_Value } from '~/model';

type Props = {
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  close: () => void;
  max_days: number;
  allowSingleDateInRange: boolean;
};
export const Calendar = ({ value, onChange, close, max_days, allowSingleDateInRange }: Props) => {
  const v = value.value;
  const [begin, end] = v;
  const dateLeft = useMemo(() => {
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
    if (begin && !end && max_days > 0) {
      // during select
      return dayjs(begin)
        .add(max_days - 1, 'days')
        .toDate();
    }
    return undefined;
  }, [begin, end, max_days]);

  const handleRangeChange = (value: DateRangeValue_Value) => {
    const [b, e] = value;
    onChange({ value, shortcut: null });
    if (b && e) {
      close();
    }
  };

  return (
    <DatePicker
      defaultDate={dateLeft}
      numberOfColumns={2}
      type="range"
      value={v}
      onChange={handleRangeChange}
      onNextMonth={console.log}
      minDate={minDate}
      maxDate={maxDate}
      allowSingleDateInRange={allowSingleDateInRange}
    />
  );
};
