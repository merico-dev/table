import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { MericoDateRangeValue, DateRangeValue_Value } from '~/model';
import { Calendar as MantineCalendar } from '@mantine/dates';
import { useGetDayProps } from './use-get-day-props';

function getDay(date: Date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: DateRangeValue_Value) => void;
  close: () => void;
  allowSingleDateInRange: boolean;
};
export const Calendar = ({ value, onChange, close, allowSingleDateInRange }: Props) => {
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
    return dayjs().add(365, 'days').toDate();
  }, []);

  const handleRangeChange = (value: DateRangeValue_Value) => {
    const [b, e] = value;
    onChange(value);
    if (b && e) {
      close();
    }
  };
  const { getDayProps } = useGetDayProps(value, handleRangeChange);

  if (value.step === 'day') {
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
  }

  return (
    <MantineCalendar defaultDate={dateLeft} numberOfColumns={2} withCellSpacing={false} getDayProps={getDayProps} />
  );
};
