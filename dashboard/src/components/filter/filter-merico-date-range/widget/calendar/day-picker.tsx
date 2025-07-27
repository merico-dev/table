import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';

type Props = {
  value: MericoDateRangeValue;
  handleRangeChange: (value: DateRangeValue_Value) => void;
};
export const DayPicker = ({ value, handleRangeChange }: Props) => {
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
    <DatePicker
      defaultDate={defaultDate}
      numberOfColumns={2}
      type="range"
      value={v}
      onChange={handleRangeChange}
      onNextMonth={console.log}
      minDate={minDate}
      maxDate={maxDate}
      allowSingleDateInRange
    />
  );
};
