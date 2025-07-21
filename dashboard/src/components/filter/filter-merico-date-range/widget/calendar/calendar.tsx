import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import { DayPicker } from './day-picker';
import { WeekPicker } from './week-picker';
import { MonthPicker } from './month-picker';
import { QuarterPicker } from './quarter-picker';

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: DateRangeValue_Value) => void;
  close: () => void;
  allowSingleDateInRange: boolean;
};
export const Calendar = ({ value, onChange, close, allowSingleDateInRange }: Props) => {
  const handleRangeChange = (value: DateRangeValue_Value) => {
    const [b, e] = value;
    onChange(value);
    if (b && e) {
      close();
    }
  };

  const step = value.step;

  if (step === 'day') {
    return (
      <DayPicker value={value} handleRangeChange={handleRangeChange} allowSingleDateInRange={allowSingleDateInRange} />
    );
  }

  if (step === 'week' || step === 'bi-week') {
    return <WeekPicker value={value} onChange={onChange} handleRangeChange={handleRangeChange} />;
  }

  if (step === 'month') {
    return (
      <MonthPicker
        value={value}
        handleRangeChange={handleRangeChange}
        allowSingleDateInRange={allowSingleDateInRange}
      />
    );
  }

  if (step === 'quarter') {
    return (
      <QuarterPicker
        value={value}
        handleRangeChange={handleRangeChange}
        allowSingleDateInRange={allowSingleDateInRange}
      />
    );
  }

  return `错误的步长：${step}`;
};
