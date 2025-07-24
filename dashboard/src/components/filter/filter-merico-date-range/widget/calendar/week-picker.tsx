import { useMemo, useState } from 'react';
import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import { useGetDayProps } from './use-get-day-props';
import { Calendar as MantineCalendar } from '@mantine/dates';

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: DateRangeValue_Value) => void;
  handleRangeChange: (v: DateRangeValue_Value) => void;
};

export const WeekPicker = ({ value, onChange, handleRangeChange }: Props) => {
  const [readonly, setReadonly] = useState(true);
  const v = value.value;
  const [begin, end] = v;

  const defaultDate = useMemo(() => {
    if (!begin) {
      return new Date();
    }
    return begin;
  }, [begin]);
  const { getDayProps } = useGetDayProps(value, handleRangeChange, readonly);
  const handleMouseEnter = () => {
    setReadonly(false);
  };
  const handleMouseLeave = () => {
    setReadonly(!!begin && !!end);
  };
  return (
    <MantineCalendar
      defaultDate={defaultDate}
      numberOfColumns={2}
      withCellSpacing={false}
      getDayProps={getDayProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};
