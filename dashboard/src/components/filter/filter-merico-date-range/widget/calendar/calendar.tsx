import { DateRangeValue_Value, MericoDateRangeValue } from '~/model';
import { DayPicker } from './day-picker';
import { WeekPicker } from './week-picker';
import { MonthPicker } from './month-picker';
import { QuarterPicker } from './quarter-picker';
import { getEndOf, getStartOf } from './utils';

type Props = {
  value: MericoDateRangeValue;
  onChange: (v: DateRangeValue_Value) => void;
  onClose: () => void;
};
export const Calendar = ({ value, onChange, onClose }: Props) => {
  const handleRangeChange = (v: DateRangeValue_Value) => {
    const [b, e] = v;
    const begin = getStartOf(b, value.step);
    const end = getEndOf(e, value.step);
    onChange([begin?.toDate() ?? null, end?.toDate() ?? null]);
    if (b && e) {
      onClose();
    }
  };

  const step = value.step;

  if (step === 'day') {
    return <DayPicker value={value} handleRangeChange={handleRangeChange} />;
  }

  if (step === 'week' || step === 'bi-week') {
    return <WeekPicker value={value} onChange={onChange} handleRangeChange={handleRangeChange} />;
  }

  if (step === 'month') {
    return <MonthPicker value={value} handleRangeChange={handleRangeChange} />;
  }

  if (step === 'quarter') {
    return <QuarterPicker value={value} handleRangeChange={handleRangeChange} />;
  }

  return `错误的步长：${step}`;
};
